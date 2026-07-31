import {
  asyncHandler,
  successResponse,
  errorResponse,
} from "../../../Utils/Response.js";
import * as lecturesService from "./lectures.service.js";
import { localize, localizeMany } from "../../../Utils/Localize/index.js";

const localizeLecture = (lecture, lang) => {
  if (!lecture) return lecture;
  let result = localize(lecture, ["title", "content"], lang);
  if (result.course) {
    result = { ...result, course: localize(result.course, ["title"], lang) };
  }
  return result;
};

export const getAllLectures = asyncHandler(async (req, res, next) => {
  const result = await lecturesService.getLectures({ req, res, next });
  const items = result.items?.map((l) => localizeLecture(l, req.lang));
  return successResponse({ res, req, message: "FETCH_SUCCESS", data: { ...result, items } });
});

export const getLecture = asyncHandler(async (req, res, next) => {
  const lecture = await lecturesService.getLectureById(req.params.id, req.user);
  return successResponse({ res, req, message: "FETCH_SUCCESS", data: localizeLecture(lecture, req.lang) });
});

export const createLecture = asyncHandler(async (req, res, next) => {
  const lecture = await lecturesService.createLecture({ req, res, next });
  return successResponse({
    res,
    req,
    message: "CREATE_SUCCESS",
    data: lecture,
    status: 201,
  });
});

export const updateLecture = asyncHandler(async (req, res, next) => {
  const lecture = await lecturesService.updateLecture({ req, res, next });
  return successResponse({
    res,
    req,
    message: "UPDATE_SUCCESS",
    data: lecture,
  });
});

export const deleteLecture = asyncHandler(async (req, res, next) => {
  await lecturesService.deleteLecture({ req, res, next });
  return successResponse({ res, req, message: "DELETE_SUCCESS" });
});

export const completeLecture = asyncHandler(async (req, res, next) => {
  const result = await lecturesService.completeLecture({ req, res, next });
  return successResponse({ res, req, message: "UPDATE_SUCCESS", data: result });
});

export const updateProgress = asyncHandler(async (req, res, next) => {
  const result = await lecturesService.updateLectureProgress({ req, res, next });
  return successResponse({ res, req, message: "UPDATE_SUCCESS", data: result });
});
