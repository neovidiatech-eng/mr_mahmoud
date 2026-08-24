import Joi from "joi";

const optionSchema = Joi.object({
  option_text_ar: Joi.string().trim().required(),

  option_text_en: Joi.string().trim().allow("", null).optional(),

  is_correct: Joi.boolean().default(false),
});

const questionSchema = Joi.object({
  question_ar: Joi.string().trim().required(),

  question_en: Joi.string().trim().allow("", null).optional(),

  type: Joi.string().valid("MCQ", "TRUE_FALSE").default("MCQ"),

  points: Joi.number().integer().min(1).required(),

  order: Joi.number().integer().min(1).required(),

  options: Joi.array().items(optionSchema).default([]),
});

export const createQuizSchema = {
  body: Joi.object({
    title_ar: Joi.string().trim().required(),

    title_en: Joi.string().trim().allow("", null).optional(),

    description_ar: Joi.string().trim().required(),

    description_en: Joi.string().trim().allow("", null).optional(),

    total_points: Joi.number().integer().min(1).required(),

    pass_points: Joi.number().integer().min(0).required(),

    duration_min: Joi.number().integer().min(1).required(),

    questions: Joi.array().items(questionSchema).min(1).required(),
  }),
};
