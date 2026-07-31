import Joi from "joi";
import { generalFields } from "../../../Utils/GeneralFields/index.js";

export const createCourseSchema = {
  body: Joi.object({
    title_ar: generalFields.name
      .messages({
        "string.base": "TITLE_INVALID",
        "string.empty": "TITLE_INVALID",
        "any.required": "TITLE_REQUIRED",
      })
      .required(),
    title_en: generalFields.name.optional().allow(""),
    description_ar: generalFields.description
      .messages({
        "string.base": "DESCRIPTION_INVALID",
        "string.empty": "DESCRIPTION_INVALID",
        "any.required": "DESCRIPTION_REQUIRED",
      })
      .required(),
    description_en: generalFields.description.optional().allow(""),
    rankId: generalFields.id
      .messages({
        "string.base": "RANK_ID_REQUIRED",
        "string.empty": "RANK_ID_REQUIRED",
        "any.required": "RANK_ID_REQUIRED",
      })
      .required(),
    categoryId: generalFields.id.optional(),
    price: Joi.number().min(0).optional(),
    keywords: Joi.array().items(Joi.string().max(32)).max(20).optional(),
  }).required(),
};

export const getCoursesSchema = {
  query: Joi.object({
    rankId: generalFields.id.optional(),
    categoryId: generalFields.id.optional(),
    title: Joi.string().optional(),
    search: generalFields.search.optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    sort: Joi.string().valid("asc", "desc").optional(),
    sortBy: Joi.string().valid("rankId", "createdAt", "title_ar").optional(),
  }).optional(),
};

export const updateCourseSchema = {
  body: Joi.object({
    title_ar: generalFields.name.messages({
      "string.base": "TITLE_INVALID",
      "string.empty": "TITLE_INVALID",
    }),
    title_en: generalFields.name.optional().allow(""),
    description_ar: generalFields.description.messages({
      "string.base": "DESCRIPTION_INVALID",
      "string.empty": "DESCRIPTION_INVALID",
    }),
    description_en: generalFields.description.optional().allow(""),

    rankId: generalFields.id.messages({
      "string.base": "RANK_ID_REQUIRED",
      "string.empty": "RANK_ID_REQUIRED",
    }),
    categoryId: generalFields.id.optional(),
    price: Joi.number().min(0).optional(),
    keywords: Joi.array().items(Joi.string().max(32)).max(20).optional(),
  }).required(),
  params: Joi.object({
    id: generalFields.id
      .messages({
        "string.base": "ID_INVALID",
        "string.empty": "ID_INVALID",
        "any.required": "ID_REQUIRED",
      })
      .required(),
  }).required(),
};

export const courseIdSchema = {
  params: Joi.object({
    id: generalFields.id
      .messages({
        "string.base": "ID_INVALID",
        "string.empty": "ID_INVALID",
        "any.required": "ID_REQUIRED",
      })
      .required(),
  }).required(),
};
