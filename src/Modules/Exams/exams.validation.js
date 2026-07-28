import joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createExam = {
  body: joi
    .object({
      title: generalFields.name.messages({
        "string.empty": "TITLE_REQUIRED",
        "any.required": "TITLE_REQUIRED",
      }),
      subject: joi.string().max(64).allow("").optional(),
      dueDate: generalFields.date.messages({
        "string.empty": "DUE_DATE_REQUIRED",
        "any.required": "DUE_DATE_REQUIRED",
      }),
      studentId: generalFields.id
        .messages({
          "string.empty": "STUDENT_ID_REQUIRED",
        })
        .required(),
      teacherId: generalFields.id.optional(),
      status: joi
        .string()
        .valid("pending", "submitted", "completed")
        .optional(),
      totalMarks: joi
        .number()
        .messages({
          "number.base": "TOTAL_MARKS_NUMBER",
          "number.empty": "TOTAL_MARKS_REQUIRED",
          "any.required": "TOTAL_MARKS_REQUIRED",
        })
        .optional(),
      duration: joi
        .number()
        .messages({
          "number.base": "DURATION_NUMBER",
          "number.empty": "DURATION_REQUIRED",
          "any.required": "DURATION_REQUIRED",
        })
        .optional(),
    })
    .required(),
};

export const updatecreateExam = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
  body: joi
    .object({
      title: joi.string().optional(),
      description: joi.string().optional(),
      subject: joi.string().max(64).allow("").optional(),
      dueDate: joi.date().optional(),
      studentId: generalFields.id.optional(),
      teacherId: generalFields.id.optional(),
      totalMarks: joi.number().optional(),
      duration: joi.number().optional(),
      status: joi
        .string()
        .valid("pending", "in_progress", "submitted", "graded", "completed")
        .optional(),
    })
    .required(),
};

export const deleteExam = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
};

export const getExam = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
};

export const getAllExams = {
  query: joi
    .object({
      studentId: generalFields.id.optional(),
      teacherId: generalFields.id.optional(),
      status: joi.string().optional(),
    })
    .optional(),
};

const optionSchema = joi.object({
  text: joi.string().min(1).max(500).required(),
  isCorrect: joi.boolean().default(false),
});

export const addQuestion = {
  params: joi.object({ id: generalFields.id.required() }).required(),
  body: joi
    .object({
      text: joi.string().min(1).max(1000).required(),
      type: joi.string().valid("mcq", "true_false").default("mcq"),
      points: joi.number().min(0).default(1),
      order: joi.number().integer().min(0).optional(),
      options: joi.array().items(optionSchema).min(2).required().messages({
        "array.min": "EXAM_QUESTION_NEEDS_OPTIONS",
      }),
    })
    .required(),
};

export const updateQuestion = {
  params: joi.object({ questionId: generalFields.id.required() }).required(),
  body: joi
    .object({
      text: joi.string().min(1).max(1000).optional(),
      type: joi.string().valid("mcq", "true_false").optional(),
      points: joi.number().min(0).optional(),
      order: joi.number().integer().min(0).optional(),
      options: joi.array().items(optionSchema).min(2).optional(),
    })
    .required(),
};

export const questionIdParam = {
  params: joi.object({ questionId: generalFields.id.required() }).required(),
};

export const examIdParam = {
  params: joi.object({ id: generalFields.id.required() }).required(),
};

export const submitExam = {
  params: joi.object({ id: generalFields.id.required() }).required(),
  body: joi
    .object({
      answers: joi
        .array()
        .items(
          joi.object({
            questionId: generalFields.id.required(),
            selectedOptionId: generalFields.id.allow(null).optional(),
          }),
        )
        .required(),
    })
    .required(),
};
