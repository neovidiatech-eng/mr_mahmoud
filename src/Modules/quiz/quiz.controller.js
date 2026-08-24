import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as quizService from "./quiz.service.js";

export const getQuizzes = asyncHandler(async (req, res, next) => {
  const quizzes = await quizService.getQuizzes({ req, res, next });
  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: quizzes,
    status: 200,
  });
});
export const getQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await quizService.getQuiz({ req, res, next });
  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: quiz,
    status: 200,
  });
});
export const createQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await quizService.createQuiz({ req, res, next });
  return successResponse({
    res,
    req,
    message: "CREATED_SUCCESS",
    data: quiz,
    status: 200,
  });
});
