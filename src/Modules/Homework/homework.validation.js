import joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createHomework = {
  body: joi
    .object({
      title_ar: joi.string().required().messages({ "any.required": "TITLE_REQUIRED" }),
      title_en: joi.string().allow("").optional(),
      description_ar: joi.string().required().messages({ "any.required": "DESCRIPTION_REQUIRED" }),
      description_en: joi.string().allow("").optional(),
      dueDate: joi.date().required(),
      studentId: generalFields.id.required(),
      subjectId: generalFields.id.optional(),
      status: joi
        .string()
        .valid("pending", "submitted", "completed", "graded")
        .optional(),
    })
    .required(),
};

export const updateHomework = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
  body: joi
    .object({
      title_ar: joi.string().optional(),
      title_en: joi.string().allow("").optional(),
      description_ar: joi.string().optional(),
      description_en: joi.string().allow("").optional(),
      dueDate: joi.date().optional(),
      studentId: generalFields.id.optional(),
      subjectId: generalFields.id.optional(),
      grade: joi.number().min(0).optional(),
      feedback: joi.string().max(2000).allow("").optional(),
      status: joi
        .string()
        .valid("pending", "submitted", "completed", "graded")
        .optional(),
    })
    .required(),
};

export const deleteHomework = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
};

export const getHomework = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
};

export const getAllHomework = {
  query: joi
    .object({
      studentId: generalFields.id.optional(),
      status: joi.string().optional(),
    })
    .optional(),
};
