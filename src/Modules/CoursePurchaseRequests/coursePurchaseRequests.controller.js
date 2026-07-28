import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../../Utils/Response.js";
import * as db from "../../database/dbService.js";
import { isAdmin } from "../../Utils/Permissions/permissions.js";

const requestInclude = {
  student: { include: { user: { select: { name: true, email: true } } } },
  course: true,
};

export const createRequest = asyncHandler(async (req, res, next) => {
  const student = req.user.student;
  const { courseId, notes } = req.body;

  if (!student) {
    return errorResponse({ req, next, message: "STUDENT_NOT_FOUND", status: 404 });
  }

  const course = await db.findOne({ model: "courses", where: { id: courseId } });
  if (!course) {
    return errorResponse({ req, next, message: "COURSE_NOT_FOUND", status: 404 });
  }

  const alreadyPurchased = await db.findFirst({
    model: "CoursePurchase",
    where: { studentId: student.id, courseId },
  });
  if (alreadyPurchased) {
    return errorResponse({ req, next, message: "COURSE_ALREADY_PURCHASED", status: 400 });
  }

  const existingPending = await db.findFirst({
    model: "course_purchase_request",
    where: { studentId: student.id, courseId, status: "pending" },
  });
  if (existingPending) {
    return errorResponse({ req, next, message: "COURSE_PURCHASE_REQUEST_EXISTS", status: 400 });
  }

  const request = await db.create({
    model: "course_purchase_request",
    data: {
      studentId: student.id,
      courseId,
      ...(notes && { notes }),
    },
    include: requestInclude,
  });

  return successResponse({
    res,
    req,
    message: "CREATE_SUCCESS",
    data: request,
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
      data: { status, ...(notes !== undefined && { notes }) },
      include: requestInclude,
    });

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
