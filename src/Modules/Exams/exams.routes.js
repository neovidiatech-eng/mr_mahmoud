import { Router } from "express";
import authentication from "../../Middlewares/Authentication.js";
import { validation } from "../../Middlewares/Validation.js";
import { authorizeResource } from "../../Middlewares/AuthorizeResource.js";
import { authorize } from "../../Middlewares/Authorize.js";
import * as examsController from "./exams.controller.js";
import * as schema from "./exams.validation.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";

const router = Router();
const examsResource = "exams";

router.post(
  "/",
  authentication,
  authorizeResource(examsResource),
  validation(schema.createExam),
  examsController.createExam,
);

router.delete(
  "/:id",
  authentication,
  authorizeResource(examsResource),
  validation(schema.deleteExam),
  examsController.deleteExam,
);

router.get(
  "/exam/:id",
  authentication,
  authorize(PERMISSIONS_V2.EXAMS.READ),
  validation(schema.getExam),
  examsController.getExam,
);

router.get(
  "/user-exams",
  authentication,
  authorize(PERMISSIONS_V2.EXAMS.READ),
  examsController.getStudentExams,
);

router.patch(
  "/:id",
  authentication,
  authorizeResource(examsResource),
  validation(schema.updatecreateExam),
  examsController.updateExam,
);

router.get(
  "/",
  authentication,
  authorizeResource(examsResource),
  validation(schema.getAllExams),
  examsController.getAllExams,
);

/* ---------------------- Question bank management ---------------------- */

router.post(
  "/:id/questions",
  authentication,
  authorizeResource(examsResource),
  validation(schema.addQuestion),
  examsController.addQuestion,
);

router.get(
  "/:id/questions",
  authentication,
  authorize(PERMISSIONS_V2.EXAMS.READ),
  validation(schema.examIdParam),
  examsController.getQuestions,
);

router.patch(
  "/questions/:questionId",
  authentication,
  authorizeResource(examsResource),
  validation(schema.updateQuestion),
  examsController.updateQuestion,
);

router.delete(
  "/questions/:questionId",
  authentication,
  authorizeResource(examsResource),
  validation(schema.questionIdParam),
  examsController.deleteQuestion,
);

/* -------------------------- Attempt lifecycle -------------------------- */

router.post(
  "/:id/start",
  authentication,
  authorize(PERMISSIONS_V2.EXAMS.READ),
  validation(schema.examIdParam),
  examsController.startExam,
);

router.post(
  "/:id/submit",
  authentication,
  authorize(PERMISSIONS_V2.EXAMS.READ),
  validation(schema.submitExam),
  examsController.submitExam,
);

export default router;
