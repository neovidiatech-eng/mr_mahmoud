import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../../../Utils/Response.js";
import * as db from "../../../database/dbService.js";

export const getAllCategories = asyncHandler(async (req, res, next) => {
  const { search } = req.query;

  const where = search
    ? {
        OR: [
          { name_ar: { contains: search, mode: "insensitive" } },
          { name_en: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [categories, count, activeCount] = await Promise.all([
    db.findMany({
      model: "category",
      where,
      orderBy: { createdAt: "desc" },
    }),
    db.count({ model: "category", where }),
    db.count({ model: "category", where: { ...where, active: true } }),
  ]);

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: { categories, count, activeCount },
    status: 200,
  });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await db.findOne({ model: "category", where: { id } });

  if (!category) {
    return errorResponse({ req, next, message: "CATEGORY_NOT_FOUND", status: 404 });
  }

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: category,
    status: 200,
  });
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name_ar, name_en, color, active } = req.body;

  const category = await db.create({
    model: "category",
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
    data: category,
    status: 201,
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name_ar, name_en, color, active } = req.body;

  const categoryExists = await db.findOne({ model: "category", where: { id } });

  if (!categoryExists) {
    return errorResponse({ req, next, message: "CATEGORY_NOT_FOUND", status: 404 });
  }

  const category = await db.updateOne({
    model: "category",
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
    data: category,
    status: 200,
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const categoryExists = await db.findOne({ model: "category", where: { id } });

  if (!categoryExists) {
    return errorResponse({ req, next, message: "CATEGORY_NOT_FOUND", status: 404 });
  }

  await db.deleteOne({ model: "category", where: { id } });

  return successResponse({
    res,
    req,
    message: "DELETE_SUCCESS",
    status: 200,
  });
});
