import { Router } from "express";
import authentication from "../../Middlewares/Authentication.js";
import { authorizeResource } from "../../Middlewares/AuthorizeResource.js";
import { validation } from "../../Middlewares/Validation.js";
import {
  createStudentSchema,
  updateStudentSchema,
  studentIdSchema,
} from "./students.validation.js";
import * as studentController from "../Students/students.controller.js";
import { fileValidation, localMulterUpload } from "../../Utils/Multer/local.multer.js";

const router = Router();
const studentResource = "users"; // Students are users

const imageUploader = localMulterUpload({
  customPath: "users/students",
  fileValidation: fileValidation.image,
}).single("image");

router.use(authentication);

router.get("/", authorizeResource(studentResource), studentController.getAllStudents);

router.post(
  "/create",
  imageUploader,
  authorizeResource(studentResource),
  validation(createStudentSchema),
  studentController.createStudent,
);

router.get(
  "/:id",
  authorizeResource(studentResource),
  validation(studentIdSchema),
  studentController.getStudentById,
);

router.patch(
  "/update/:id",
  imageUploader,
  authorizeResource(studentResource),
  validation(updateStudentSchema),
  studentController.updateStudent,
);

router.delete(
  "/:id",
  authorizeResource(studentResource),
  validation(studentIdSchema),
  studentController.deleteStudent,
);

export default router;
