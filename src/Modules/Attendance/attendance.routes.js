import { Router } from "express";
import authentication from "../../Middlewares/Authentication.js";
import { authorize } from "../../Middlewares/Authorize.js";
import { validation } from "../../Middlewares/Validation.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";
import * as attendanceController from "./attendance.controller.js";
import * as schema from "./attendance.validation.js";

const router = Router();

router.use(authentication);

router.post(
  "/check-in",
  authorize(PERMISSIONS_V2.ATTENDANCE.CREATE),
  validation(schema.checkInSchema),
  attendanceController.checkIn,
);

router.get(
  "/today",
  authorize(PERMISSIONS_V2.ATTENDANCE.READ),
  attendanceController.getTodaySummary,
);

router.get(
  "/",
  authorize(PERMISSIONS_V2.ATTENDANCE.READ),
  validation(schema.getAttendanceSchema),
  attendanceController.getAttendanceList,
);

router.get(
  "/student/:studentId",
  authorize(PERMISSIONS_V2.ATTENDANCE.READ),
  validation(schema.getStudentAttendanceSchema),
  attendanceController.getStudentAttendance,
);

router.patch(
  "/:id",
  authorize(PERMISSIONS_V2.ATTENDANCE.UPDATE),
  validation(schema.updateAttendanceSchema),
  attendanceController.updateAttendanceStatus,
);

router.delete(
  "/:id",
  authorize(PERMISSIONS_V2.ATTENDANCE.DELETE),
  validation(schema.attendanceIdSchema),
  attendanceController.deleteAttendance,
);

export default router;
