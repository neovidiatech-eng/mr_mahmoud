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
    message: "QUIZ_CREATED",
    data: quiz,
    status: 201,
  });
});

export const submitQuiz = asyncHandler(async (req, res, next) => {
  const result = await quizService.submitQuiz({ req, res, next });
  return successResponse({
    res,
    req,
    message: "QUIZ_SUBMITTED",
    data: result,
    status: 201,
  });
});

export const getQuizHistory = asyncHandler(async (req, res, next) => {
  const history = await quizService.getQuizHistory({ req, res, next });
  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: history,
    status: 200,
  });
});

export const getQuizAttemptDetails = asyncHandler(async (req, res, next) => {
  const attempt = await quizService.getQuizAttemptDetails({ req, res, next });
  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: attempt,
    status: 200,
  });
});

export const updateQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await quizService.updateQuiz({ req, res, next });
  return successResponse({
    res,
    req,
    message: "QUIZ_UPDATED",
    data: quiz,
    status: 200,
  });
});

export const deleteQuiz = asyncHandler(async (req, res, next) => {
  const result = await quizService.deleteQuiz({ req, res, next });
  return successResponse({
    res,
    req,
    message: "QUIZ_DELETED",
    data: result,
    status: 200,
  });
});
