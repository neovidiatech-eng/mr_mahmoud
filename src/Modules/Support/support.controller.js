import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as service from "./support.service.js";
import { localize, localizeMany } from "../../Utils/Localize/index.js";

const localizeSupport = (item, lang) => {
  if (!item) return item;
  let result = localize(item, ["title", "description"], lang);
  if (result.category) {
    result = { ...result, category: localize(result.category, ["title"], lang) };
  }
  return result;
};

// --- Support Controllers ---
export const getSupport = asyncHandler(async (req, res, next) => {
  const data = await service.getSupport({ req, res, next });
  return successResponse({ res, req, data: data.map((s) => localizeSupport(s, req.lang)), message: "FETCH_SUCCESS", status: 200 });
});

export const  getSupportById = asyncHandler(async (req, res, next) => {
  const data = await service.getSupportById({ req, res, next });
  return successResponse({ res, req, data: localizeSupport(data, req.lang), message: "FETCH_SUCCESS", status: 200 });
});

export const createSupport = asyncHandler(async (req, res, next) => {
  const data = await service.createSupport({ req, res, next });
  return successResponse({ res, req, data, message: "CREATE_SUCCESS", status: 201 });
});

export const updateSupport = asyncHandler(async (req, res, next) => {
  const data = await service.updateSupport({ req, res, next });
  return successResponse({ res, req, data, message: "UPDATE_SUCCESS", status: 200 });
});

export const deleteSupport = asyncHandler(async (req, res, next) => {
  const data = await service.deleteSupport({ req, res, next });
  return successResponse({ res, req, data, message: "DELETE_SUCCESS", status: 200 });
});

// --- Category Controllers ---
export const getCategories = asyncHandler(async (req, res, next) => {
  const data = await service.getCategories({ req, res, next });
  const localized = data.map((c) => {
    let cat = localize(c, ["title"], req.lang);
    if (Array.isArray(cat.supports)) {
      cat = { ...cat, supports: localizeMany(cat.supports, ["title", "description"], req.lang) };
    }
    return cat;
  });
  return successResponse({ res, req, data: localized, message: "FETCH_SUCCESS", status: 200 });
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const data = await service.createCategory({ req, res, next });
  return successResponse({ res, req, data, message: "CREATE_SUCCESS", status: 201 });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const data = await service.updateCategory({ req, res, next });
  return successResponse({ res, req, data, message: "UPDATE_SUCCESS", status: 200 });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const data = await service.deleteCategory({ req, res, next });
  return successResponse({ res, req, data, message: "DELETE_SUCCESS", status: 200 });
});
export const getTeacherSupport = asyncHandler(async (req, res, next) => {
  const data = await service.getTeacherSupport({ req, res, next });
  const localized = data.map((item) => ({
    ...item,
    popular: localizeMany(item.popular, ["title", "description"], req.lang),
    category: item.category ? localize(item.category, ["title"], req.lang) : item.category,
  }));
  return successResponse({ res, req, data: localized, message: "FETCH_SUCCESS", status: 200 });
});
