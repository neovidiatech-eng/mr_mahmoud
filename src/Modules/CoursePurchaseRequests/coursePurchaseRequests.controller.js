import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../../Utils/Response.js";
import * as db from "../../database/dbService.js";
import { isAdmin } from "../../Utils/Permissions/permissions.js";
import fs from "node:fs";
import path from "node:path";

const requestInclude = {
  student: { include: { user: { select: { name: true, email: true, phone: true } } } },
  course: true,
};

export const createRequest = asyncHandler(async (req, res, next) => {
  const student = req.user.student;
  const { courseId, courseIds, parentPhone, notes } = req.body;
  const receipt_img = req.file?.finalPath || req.file?.path || null;

  if (!student) {
    return errorResponse({ req, next, message: "STUDENT_NOT_FOUND", status: 404 });
  }

  const targetCourseIds = Array.isArray(courseIds) && courseIds.length > 0
    ? courseIds
    : (courseId ? [courseId] : []);

  if (targetCourseIds.length === 0) {
    return errorResponse({ req, next, message: "COURSE_ID_REQUIRED", status: 400 });
  }

  const createdRequests = [];
  const errors = [];
   const courses = await db.findMany({ model: "courses", where: { id: {in: targetCourseIds} } });

  for (const cId of targetCourseIds) {
    const course=courses.find(el=>el.id===cId);
   
    if (!course) {
      errors.push({ courseId: cId, error: "COURSE_NOT_FOUND" });
      continue;
    }

    const alreadyPurchased = await db.findFirst({
      model: "CoursePurchase",
      where: { studentId: student.id, courseId: cId },
    });
    if (alreadyPurchased) {
      errors.push({ courseId: cId, error: "COURSE_ALREADY_PURCHASED" });
      continue;
    }

    const existingPending = await db.findFirst({
      model: "course_purchase_request",
      where: { studentId: student.id, courseId: cId, status: "pending" },
    });
    if (existingPending) {
      errors.push({ courseId: cId, error: "COURSE_PURCHASE_REQUEST_EXISTS" });
      continue;
    }

    const request = await db.create({
      model: "course_purchase_request",
      data: {
        studentId: student.id,
        courseId: cId,
        receipt_img,
        ...(parentPhone && { parentPhone }),
        ...(notes && { notes }),
      },
      include: requestInclude,
    });
    createdRequests.push(request);
  }

  if (createdRequests.length === 0 && errors.length > 0) {
    return errorResponse({
      req,
      next,
      message: errors[0].error,
      status: 400,
    });
  }

  return successResponse({
    res,
    req,
    message: "CREATE_SUCCESS",
    data: { requests: createdRequests, errors },
    status: 201,
  });
});

export const getRequests = asyncHandler(async (req, res, next) => {
  const { status, page, limit } = req.query;

  const condition = {};
  if (status) condition.status = status;

  if (!isAdmin(req.user)) {
    if (!req.user.student) {
      return errorResponse({ req, next, message: "STUDENT_NOT_FOUND", status: 404 });
    }
    condition.studentId = req.user.student.id;
  }

  const { items, pagination } = await db.findManyWithPaginationAndCount({
    model: "course_purchase_request",
    where: condition,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    include: requestInclude,
    orderBy: { createdAt: "desc" },
  });

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: { items, pagination },
    status: 200,
  });
});

export const changeStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const request = await db.findOne({
    model: "course_purchase_request",
    where: { id },
  });

  if (!request) {
    return errorResponse({ req, next, message: "COURSE_PURCHASE_REQUEST_NOT_FOUND", status: 404 });
  }

  if (request.status !== "pending") {
    return errorResponse({ req, next, message: "REQUEST_ALREADY_PROCESSED", status: 400 });
  }

  let updated;
  await db.transaction(async (tx) => {
    updated = await tx.updateOne({
      model: "course_purchase_request",
      where: { id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
        ...(request.receipt_img && { receipt_img: null }),
      },
      include: requestInclude,
    });

    if (request.receipt_img) {
      try {
        const relativePath = request.receipt_img;
        const fullFilePath = relativePath.startsWith("src/")
          ? path.resolve(`./${relativePath}`)
          : path.resolve(`./src/${relativePath}`);

        if (fs.existsSync(fullFilePath)) {
          fs.unlinkSync(fullFilePath);
        }
      } catch (err) {
        console.error("[Delete Course Purchase Receipt Image Error]:", err);
      }
    }

    if (status === "approved") {
      await tx.upsertOne({
        model: "CoursePurchase",
        where: {
          studentId_courseId: {
            studentId: request.studentId,
            courseId: request.courseId,
          },
        },
        create: { studentId: request.studentId, courseId: request.courseId },
        update: {},
      });
    }
  });

  return successResponse({
    res,
    req,
    message: "UPDATE_SUCCESS",
    data: updated,
    status: 200,
  });
});
