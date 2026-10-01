import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as service from "./posts.service.js";
import { localize, localizeMany } from "../../Utils/Localize/index.js";

const fields = ["title", "excerpt", "content"];

export const getPosts = asyncHandler(async (req, res, next) => {
  const data = await service.getPosts({ req, res, next });
  const items = localizeMany(data.items, fields, req.lang);
  return successResponse({ res, req, data: { ...data, items }, message: "FETCH_SUCCESS", status: 200 });
});

export const getPostBySlug = asyncHandler(async (req, res, next) => {
  const data = await service.getPostBySlug({ req, res, next });
  return successResponse({ res, req, data: localize(data, fields, req.lang), message: "FETCH_SUCCESS", status: 200 });
});

export const getPostById = asyncHandler(async (req, res, next) => {
  const data = await service.getPostById({ req, res, next });
  return successResponse({ res, req, data: localize(data, fields, req.lang), message: "FETCH_SUCCESS", status: 200 });
});

export const createPost = asyncHandler(async (req, res, next) => {
  const data = await service.createPost({ req, res, next });
  return successResponse({ res, req, data, message: "CREATE_SUCCESS", status: 201 });
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const data = await service.updatePost({ req, res, next });
  return successResponse({ res, req, data, message: "UPDATE_SUCCESS", status: 200 });
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const data = await service.deletePost({ req, res, next });
  return successResponse({ res, req, data, message: "DELETE_SUCCESS", status: 200 });
});
