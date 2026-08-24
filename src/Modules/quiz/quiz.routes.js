import { Router } from "express";
import authentication from "../../Middlewares/Authentication.js";
import { authorize } from "../../Middlewares/Authorize.js";
import * as controller from "./quiz.controller.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";
import * as schema from "./quiz.validation.js";
import { validation } from "../../Middlewares/Validation.js";

const router = Router();

router.get(
  "/",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.READ),
  controller.getQuizzes,
);

router.get(
  "/history",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.READ),
  validation(schema.getQuizHistorySchema),
  controller.getQuizHistory,
);

router.get(
  "/history/:id",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.READ),
  validation(schema.getQuizAttemptDetailsSchema),
  controller.getQuizAttemptDetails,
);

router.get(
  "/:id",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.READ),
  validation(schema.getQuizSchema),
  controller.getQuiz,
);

router.post(
  "/",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.CREATE),
  validation(schema.createQuizSchema),
  controller.createQuiz,
);

router.post(
  "/submit",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.SUBMIT),
  validation(schema.submitQuizSchema),
  controller.submitQuiz,
);

router.patch(
  "/:id",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.UPDATE),
  validation(schema.updateQuizSchema),
  controller.updateQuiz,
);

router.delete(
  "/:id",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.DELETE),
  validation(schema.deleteQuizSchema),
  controller.deleteQuiz,
);

export default router;
