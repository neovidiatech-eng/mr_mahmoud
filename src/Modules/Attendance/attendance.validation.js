import Joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const checkInSchema = {
  body: Joi.object()
    .keys({
      qrToken: Joi.string().trim().messages({
        "string.base": "QR_TOKEN_STRING",
      }),
      studentId: generalFields.id,
      status: Joi.string()
        .valid("present", "absent", "late")
        .default("present")
        .messages({
          "any.only": "STATUS_INVALID",
        }),
      attendanceDate: Joi.date().iso().messages({
        "date.format": "INVALID_DATE_FORMAT",
      }),
    })
    .or("qrToken", "studentId")
    .messages({
      "object.missing": "QR_TOKEN_OR_STUDENT_ID_REQUIRED",
    }),
};

export const getAttendanceSchema = {
  query: Joi.object().keys({
    page: generalFields.page,
    limit: generalFields.limit,
    search: generalFields.search,
    date: Joi.date().iso(),
    status: Joi.string().valid("present", "absent", "late"),
    studentId: generalFields.id,
  }),
};

export const getStudentAttendanceSchema = {
  params: Joi.object().keys({
    studentId: generalFields.id.required(),
  }),
  query: Joi.object().keys({
    page: generalFields.page,
    limit: generalFields.limit,
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    status: Joi.string().valid("present", "absent", "late"),
  }),
};

export const updateAttendanceSchema = {
  params: Joi.object().keys({
    id: generalFields.id.required(),
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .valid("present", "absent", "late")
      .required()
      .messages({
        "any.only": "STATUS_INVALID",
        "any.required": "STATUS_REQUIRED",
      }),
  }),
};

export const attendanceIdSchema = {
  params: Joi.object().keys({
    id: generalFields.id.required(),
  }),
};
