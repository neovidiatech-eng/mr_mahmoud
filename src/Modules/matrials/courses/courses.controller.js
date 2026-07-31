import { asyncHandler, successResponse, errorResponse } from "../../../Utils/Response.js";
import * as coursesService from "./courses.service.js";
import { localize, localizeMany } from "../../../Utils/Localize/index.js";

const localizeCourse = (course, lang) => {
  if (!course) return course;
  let result = localize(course, ["title", "description"], lang);

  if (result.rank) {
    result = { ...result, rank: localize(result.rank, ["name", "stageName"], lang) };
  }
  if (result.category) {
    result = { ...result, category: localize(result.category, ["name"], lang) };
  }
  if (Array.isArray(result.lectures)) {
    result = { ...result, lectures: localizeMany(result.lectures, ["title", "content"], lang) };
  }
  return result;
};

export const getAllCourses = asyncHandler(async (req, res, next) => {
    const result = await coursesService.getCourses(req.query);
    const items = result.items?.map((c) => localizeCourse(c, req.lang));
    return successResponse({ res, req, message: "FETCH_SUCCESS", data: { ...result, items } });
});

export const getCourse = asyncHandler(async (req, res, next) => {
    const course = await coursesService.getCourseById(req.params.id);
    return successResponse({ res, req, message: "FETCH_SUCCESS", data: localizeCourse(course, req.lang) });
});

export const createCourse = asyncHandler(async (req, res, next) => {
    const course = await coursesService.createCourse({req,res,next});
    return successResponse({ res, req, message: "CREATE_SUCCESS", data: course, status: 201 });
});

export const updateCourse = asyncHandler(async (req, res, next) => {
    const course = await coursesService.updateCourse({req,res,next});
    return successResponse({ res, req, message: "UPDATE_SUCCESS", data: course });
});



export const deleteCourse = asyncHandler(async (req, res, next) => {
    await coursesService.deleteCourse({req,res,next});
    return successResponse({ res, req, message: "DELETE_SUCCESS" });
});

export const getCourseLecturesForStudent = asyncHandler(async (req, res, next) => {
    const result = await coursesService.getCourseLecturesForStudent({req,res,next});
    const localized = localizeCourse(result, req.lang);
    return successResponse({ res, req, message: "FETCH_SUCCESS", data: localized });
});
