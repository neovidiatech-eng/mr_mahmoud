import Joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

const optionSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  option_text_ar: Joi.string().trim().required(),
  option_text_en: Joi.string().trim().allow("", null).optional(),
  is_correct: Joi.boolean().default(false),
});

const questionSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  question_ar: Joi.string().trim().required(),
  question_en: Joi.string().trim().allow("", null).optional(),
  type: Joi.string().valid("MCQ", "TRUE_FALSE").default("MCQ"),
  points: Joi.number().integer().min(1).required(),
  order: Joi.number().integer().min(1).required(),
  options: Joi.array().items(optionSchema).default([]),
});

const submitAnswerSchema = Joi.object({
  question_id: generalFields.id.required(),
  option_id: Joi.string().uuid().allow(null).optional(),
});

export const createQuizSchema = {
  body: Joi.object({
    title_ar: Joi.string().trim().required(),
    title_en: Joi.string().trim().allow("", null).optional(),
    order: Joi.number().integer().min(0).optional(),
    description_ar: Joi.string().trim().allow("", null).optional(),
    description_en: Joi.string().trim().allow("", null).optional(),
    total_points: Joi.number().integer().min(1).required(),
    courseId: generalFields.id.optional().allow("", null),
    pass_points: Joi.number().integer().min(0).required(),
    duration_min: Joi.number().integer().min(1).required(),
    questions: Joi.array().items(questionSchema).min(1).required(),
  }),
};

export const getQuizSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
};

export const updateQuizSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  body: Joi.object({
    title_ar: Joi.string().trim().optional(),
    title_en: Joi.string().trim().allow("", null).optional(),
    order: Joi.number().integer().min(0).optional(),
    description_ar: Joi.string().trim().optional(),
    description_en: Joi.string().trim().allow("", null).optional(),
    total_points: Joi.number().integer().min(1).optional(),
    pass_points: Joi.number().integer().min(0).optional(),
    duration_min: Joi.number().integer().min(1).optional(),
    questions: Joi.array().items(questionSchema).optional(),
  }).min(1),
};

export const deleteQuizSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
};

export const submitQuizSchema = {
  body: Joi.object({
    quiz_id: generalFields.id.required(),
    answers: Joi.array().items(submitAnswerSchema).required(),
  }),
};

export const getQuizHistorySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    quiz_id: Joi.string().uuid().optional(),
  }),
};

export const getQuizAttemptDetailsSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
};
