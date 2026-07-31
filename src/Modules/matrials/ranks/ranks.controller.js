import * as service from "./ranks.service.js";
import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import { localize, localizeMany } from "../../../Utils/Localize/index.js";

const localizeRank = (rank, lang) => {
  if (!rank) return rank;
  let result = localize(rank, ["name", "stageName"], lang);
  if (Array.isArray(result.courses)) {
    result = {
      ...result,
      courses: result.courses.map((c) => {
        let course = localize(c, ["title", "description"], lang);
        if (Array.isArray(course.lectures)) {
          course = { ...course, lectures: localizeMany(course.lectures, ["title", "content"], lang) };
        }
        return course;
      }),
    };
  }
  return result;
};

export const addRank = asyncHandler(async (req, res, next) => {
  const data = await service.addRank(req, res, next);
  return successResponse({
    res,
    req,
    status: 201,
    message: "CREATE_SUCCESS",
    data,
  });
});

export const getRanks = asyncHandler(async (req, res, next) => {
  const data = await service.getRanks(req, res, next);
  const items = data.items?.map((r) => localizeRank(r, req.lang));
  return successResponse({
    res,
    req,
    status: 200,
    message: "FETCH_SUCCESS",
    data: { ...data, items },
  });
});

export const getRank = asyncHandler(async (req, res, next) => {
  const data = await service.getRank(req, res, next);
  return successResponse({
    res,
    req,
    status: 200,
    message: "FETCH_SUCCESS",
    data: localizeRank(data, req.lang),
  });
});

export const updateRank = asyncHandler(async (req, res, next) => {
  const data = await service.updateRank(req, res, next);
  return successResponse({
    res,
    req,
    status: 200,
    message: "UPDATE_SUCCESS",
    data,
  });
});

export const deleteRank = asyncHandler(async (req, res, next) => {
  await service.deleteRank(req, res, next);
  return successResponse({
    res,
    req,
    status: 200,
    message: "DELETE_SUCCESS",
  });
});
