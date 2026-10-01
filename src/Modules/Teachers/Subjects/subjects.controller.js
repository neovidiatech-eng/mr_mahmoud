import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../../../Utils/Response.js";
import * as db from "../../../database/dbService.js";

export const getAllSubjects = asyncHandler(async (req, res, next) => {
  const { search } = req.query;

  const where = search
    ? {
        OR: [
          { name_ar: { contains: search, mode: "insensitive" } },
          { name_en: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [subjects, count, activeCount] = await Promise.all([
    db.findMany({
      model: "subject",
      where,
      orderBy: { createdAt: "desc" },
    }),
    db.count({ model: "subject", where }),
    db.count({ model: "subject", where: { ...where, active: true } }),
  ]);

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: { subjects, count, activeCount },
    status: 200,
  });
});

export const getSubject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subject = await db.findOne({ model: "subject", where: { id } });

  if (!subject) {
    return errorResponse({ req, next, message: "SUBJECT_NOT_FOUND", status: 404 });
  }

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: subject,
    status: 200,
  });
});

export const createSubject = asyncHandler(async (req, res, next) => {
  const { name_ar, name_en, color, active } = req.body;

  const subject = await db.create({
    model: "subject",
    data: {
      name_ar,
      ...(name_en !== undefined && { name_en }),
      ...(color !== undefined && { color }),
      ...(active !== undefined && { active }),
    },
  });

  return successResponse({
    res,
    req,
    message: "CREATE_SUCCESS",
    data: subject,
    status: 201,
  });
});

export const updateSubject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name_ar, name_en, color, active } = req.body;

  const subjectExists = await db.findOne({ model: "subject", where: { id } });

  if (!subjectExists) {
    return errorResponse({ req, next, message: "SUBJECT_NOT_FOUND", status: 404 });
  }

  const subject = await db.updateOne({
    model: "subject",
    where: { id },
    data: {
      ...(name_ar !== undefined && { name_ar }),
      ...(name_en !== undefined && { name_en }),
      ...(color !== undefined && { color }),
      ...(active !== undefined && { active }),
    },
  });

  return successResponse({
    res,
    req,
    message: "UPDATE_SUCCESS",
    data: subject,
    status: 200,
  });
});

export const deleteSubject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subjectExists = await db.findOne({ model: "subject", where: { id } });

  if (!subjectExists) {
    return errorResponse({ req, next, message: "SUBJECT_NOT_FOUND", status: 404 });
  }

  await db.deleteOne({ model: "subject", where: { id } });

  return successResponse({
    res,
    req,
    message: "DELETE_SUCCESS",
    status: 200,
  });
});
