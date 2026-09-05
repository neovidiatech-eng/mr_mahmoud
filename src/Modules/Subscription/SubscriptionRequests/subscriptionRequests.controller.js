import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../../../Utils/Response.js";
import * as db from "../../../database/dbService.js";
import { redis } from "../../../Utils/Radis/Connection.js";
import { decryptText } from "../../../Utils/Security/index.js";
import { ensureExists } from "../../../database/genericService.js";
import {
  convertAmount,
  resolveStudentAge,
} from "../../../Utils/Helpers.js";

import fs from "node:fs";
import path from "node:path";

export const getSubscriptionRequests = asyncHandler(async (req, res, next) => {
  const { search, status, page = 1, limit = 10 } = req.query;

  let where = {};
  if (search) {
    where = {
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { plan: { name: { contains: search, mode: "insensitive" } } },
      ],
    };
  }
  if (status) {
    where.status = status;
  }

  const { items: subscriptionRequests, pagination } =
    await db.findManyWithPaginationAndCount({
      model: "subscription_requests",
      where,
      page,
      limit,
      include: {
        user: {
          include: {
            student: {
              include: {
                stage: true,
                rank: true,
              },
            },
          },
        },
        plan: true,
      },
    });

  const requests = await Promise.all(
    subscriptionRequests.map(async (s) => {
      if (!s.user) return s;

      const redisKey = s.user.email ? `${s.user.email}_Student_data` : null;
      const studentDataJson = redisKey ? await redis.get(redisKey) : null;

      let parsedStudentData = null;
      if (studentDataJson) {
        try {
          parsedStudentData = JSON.parse(studentDataJson);
        } catch (err) {
          console.error("[Redis JSON Parse Error]:", err);
        }
      }

      const stageId = parsedStudentData?.stageId || s.user.student?.stageId || null;
      const rankId = parsedStudentData?.rankId || s.user.student?.rankId || null;
      const parentNumber = parsedStudentData?.parentNumber || s.user.student?.parentNumber || null;

      let stageObj = s.user.student?.stage || null;
      let rankObj = s.user.student?.rank || null;

      if (!stageObj && stageId) {
        stageObj = await db.findOne({ model: "stage", where: { id: stageId } });
      }

      if (!rankObj && rankId) {
        rankObj = await db.findOne({ model: "ranks", where: { id: rankId } });
      }

      return {
        ...s,
        user: {
          ...s.user,
          parentNumber,
          stageId,
          rankId,
          stage: stageObj,
          rank: rankObj,
        },
      };
    })
  );

  // Decrypt phone numbers and passwords for display
  for (const s of requests) {
    if (s.user && s.user.phone && s.user.phone !== "null") {
      s.user.phone = await decryptText({ text: s.user.phone });
    }
    if (s.user && s.user.password) {
      s.user.password = await decryptText({ text: s.user.password });
    }
  }

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    status: 200,
    data: { subscriptionRequests: requests, pagination },
  });
});


export const changeStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const subscriptionRequest = await ensureExists({
    model: "subscription_requests",
    where: { id },
    include: {
      user: true,
      plan: true,
    },
    message: "REQUEST_NOT_FOUND",
  });

  if (subscriptionRequest.status !== "pending") {
    return errorResponse({
      next,
      req,
      message: "REQUEST_ALREADY_PROCESSED",
      status: 400,
    });
  }

  const redisKey = `${subscriptionRequest.user.email}_Student_data`;

  const studentDataJson = await redis.get(redisKey);
  const parsedStudentData = studentDataJson
    ? JSON.parse(studentDataJson)
    : null;

  if (status === "approved" && !parsedStudentData) {
    return errorResponse({
      next,
      req,
      message: "PENDING_DATA_NOT_FOUND",
      status: 404,
    });
  }

  let studentAge = null;
  if (status === "approved") {
    studentAge = resolveStudentAge({
      age: parsedStudentData?.age,
      birthDate: parsedStudentData?.birth_date,
    });

    if(!parsedStudentData?.rankId){
      return errorResponse({
        next,
        req,
        message:"RANK_NOT_FOUND",
        status:404,
      })
    }

    if(!parsedStudentData?.stageId){
      return errorResponse({
        next,
        req,
        message:"STAGE_NOT_FOUND",
        status:404,
      })
    }
    const selectStage =await ensureExists({
      model:"stage",
      where:{
        id:parsedStudentData.stageId,
      },
      message:"STAGE_NOT_FOUND"
    });
    if(selectStage.rankId !== parsedStudentData.rankId){
      return errorResponse({
        next,
        req,
        message:"STAGE_NOT_BELONG_TO_RANK",
        status:404,
      })
    }

  }

  const studentRole = await db.findFirst({
    model: "role",
    where: { name: { equals: "student", mode: "insensitive" } },
  });

  try {
    await db.transaction(async (tx) => {
      // ✅ system wallet & currencies
      const [systemWallet, defaultCurrency] = await Promise.all([
        tx.findFirst({
          model: "wallet",
          where: { type: "system" },
        }),
        tx.findFirst({
          model: "currency",
          where: { default: true },
        }),
      ]);

      if (!systemWallet || !defaultCurrency) {
        const error = new Error("SYSTEM_CONFIGURATION_ERROR");
        error.cause = 500;
        error.isMessageKey = true;
        throw error;
      }

      // Update user status
      await tx.updateOne({
        model: "user",
        where: { id: subscriptionRequest.user_id },
        data: {
          status: status === "approved" ? "active" : "rejected",
          ...(status === "approved" &&
            studentAge !== null && { age: studentAge }),
          ...(status === "approved" &&
            studentRole && { roleId: studentRole.id }),
        },
      });

      // Update request status & set subscrption_img to null
      await tx.updateOne({
        model: "subscription_requests",
        where: { id },
        data: {
          status,
          ...(subscriptionRequest.subscrption_img && { subscrption_img: null }),
        },
      });

      // Delete physical file from disk
      if (subscriptionRequest.subscrption_img) {
        try {
          const relativePath = subscriptionRequest.subscrption_img;
          const fullFilePath = relativePath.startsWith("src/")
            ? path.resolve(`./${relativePath}`)
            : path.resolve(`./src/${relativePath}`);

          if (fs.existsSync(fullFilePath)) {
            fs.unlinkSync(fullFilePath);
          }
        } catch (err) {
          console.error("[Delete Subscription Image Error]:", err);
        }
      }

      if (status !== "approved") return;

      // Student creation
      const existingStudent = await tx.findFirst({
        model: "student",
        where: { user_id: subscriptionRequest.user_id },
      });

      if (existingStudent) {
        const error = new Error("STUDENT_ALREADY_EXISTS");
        error.cause = 409;
        error.isMessageKey = true;
        throw error;
      }

      await tx.create({
        model: "student",
        data: {
          user: { connect: { id: subscriptionRequest.user_id } },
          ...(parsedStudentData.birth_date && {
            birth_date: new Date(parsedStudentData.birth_date),
          }),
          country: parsedStudentData.country,
          ...(parsedStudentData.parentNumber && { parentNumber: parsedStudentData.parentNumber }),
          plan: { connect: { id: subscriptionRequest.planId } },
          sessions: subscriptionRequest.plan?.sessionsCount || 0,
          sessions_remaining: subscriptionRequest.plan?.sessionsCount || 0,
          status: "approved",
          active: true,
          rank: { connect: { id: parsedStudentData.rankId } },
          stage: { connect: { id: parsedStudentData.stageId } },
        },
      });

      // Fetch plan with currency
      const plan = await tx.findOne({
        model: "plan",
        where: { id: subscriptionRequest.planId },
        include: { currency: true },
      });

      const rawPrice = parseFloat(plan?.price) || 0;
      const convertedAmount = convertAmount(
        rawPrice,
        plan.currency.exchangeRate,
        defaultCurrency.exchangeRate,
      );

      // Create subscription
      const subscription = await tx.create({
        model: "Subscription",
        data: {
          userId: subscriptionRequest.user_id,
          planId: subscriptionRequest.planId,
          status: "active",
          amount: rawPrice,
          currencyId: plan.currencyId,
          startDate: new Date(),
          paidAt: new Date(),
        },
      });

      // Ledger (transaction)
      await tx.create({
        model: "Transaction",
        data: {
          walletId: systemWallet.id,
          type: "subscription",
          amount: convertedAmount,
          status: "completed",
          reason: `Subscription: ${plan.name}`,
          subscriptionId: subscription.id,
        },
      });

      // Update wallet balance
      await tx.updateOne({
        model: "Wallet",
        where: { id: systemWallet.id },
        data: {
          balance: { increment: convertedAmount },
        },
      });
    });

    await redis.del(redisKey);

    return successResponse({
      res,
      req,
      message: status === "approved" ? "REQUEST_APPROVED" : "REQUEST_REJECTED",
      status: 200,
    });
  } catch (error) {
    const err = new Error(
      error.isMessageKey ? error.message : "INTERNAL_SERVER_ERROR",
    );
    err.cause = error.cause || 500;
    err.isMessageKey = true;
    return next(err);
  }
});
