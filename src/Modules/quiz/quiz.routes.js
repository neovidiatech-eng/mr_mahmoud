import { Router } from "express";
import authentication from "../../Middlewares/Authentication.js"  
import { authorize } from "../../Middlewares/Authorize.js";
import * as controller from "./quiz.controller.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";
import * as schema from "./quiz.validation.js";
import {validation} from "../../Middlewares/Validation.js";
const router = Router();

router.get(
  "/",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.READ),
  controller.getQuizzes,
);

router.get(
  "/:id",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.READ),
  controller.getQuiz,
);

router.post(
  "/",
  authentication,
  authorize(PERMISSIONS_V2.QUIZ.CREATE),
  validation(schema.createQuizSchema),
  controller.createQuiz,
);


export default router;
