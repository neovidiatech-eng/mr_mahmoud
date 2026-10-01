import { Router } from "express";
import * as subjectsController from "./subjects.controller.js";
import { validation } from "../../../Middlewares/Validation.js";
import { authorizeResource } from "../../../Middlewares/AuthorizeResource.js";
import * as schema from "./subjects.validation.js";

const router = Router();
const subjectsResource = "subjects";

router.get(
  "/",
  authorizeResource(subjectsResource),
  validation(schema.getSubjectsSchema),
  subjectsController.getAllSubjects,
);

router.get(
  "/:id",
  authorizeResource(subjectsResource),
  validation(schema.getSubjectSchema),
  subjectsController.getSubject,
);

router.post(
  "/create",
  authorizeResource(subjectsResource),
  validation(schema.createSubjectSchema),
  subjectsController.createSubject,
);

router.patch(
  "/update/:id",
  authorizeResource(subjectsResource),
  validation(schema.updateSubjectSchema),
  subjectsController.updateSubject,
);

router.delete(
  "/delete/:id",
  authorizeResource(subjectsResource),
  validation(schema.deleteSubjectSchema),
  subjectsController.deleteSubject,
);

export default router;
