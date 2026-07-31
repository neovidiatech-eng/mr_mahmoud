import Joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createSupport = {
  body: Joi.object({
    title_ar: generalFields.name
      .messages({
        "string.empty": "TITLE_REQUIRED",
        "string.min": "NAME_MIN",
        "string.max": "NAME_MAX",
      })
      .required(),
    title_en: generalFields.name.optional().allow(""),
    url: generalFields.url
      .messages({
        "string.empty": "LINK_REQUIRED",
        "string.uri": "LINK_INVALID",
      })
      .required(),
    description_ar: generalFields.description
      .messages({
        "string.empty": "DESCRIPTION_REQUIRED",
        "string.min": "DESCRIPTION_INVALID",
        "string.max": "DESCRIPTION_INVALID",
      })
      .required(),
    description_en: generalFields.description.optional().allow(""),
    categoryId: generalFields.id
      .messages({
        "string.empty": "ID_REQUIRED",
        "string.min": "ID_INVALID",
        "string.max": "ID_INVALID",
      })
      .required(),
    active: Joi.boolean(),
  }).required(),
};

export const updateSupport = {
  body: Joi.object({
    title_ar: generalFields.name.messages({
      "string.empty": "TITLE_REQUIRED",
      "string.min": "NAME_MIN",
      "string.max": "NAME_MAX",
    }),
    title_en: generalFields.name.optional().allow(""),
    url: generalFields.url.messages({
      "string.empty": "LINK_REQUIRED",
      "string.uri": "LINK_INVALID",
    }),
    description_ar: generalFields.description.messages({
      "string.empty": "DESCRIPTION_REQUIRED",
      "string.min": "DESCRIPTION_INVALID",
      "string.max": "DESCRIPTION_INVALID",
    }),
    description_en: generalFields.description.optional().allow(""),
    categoryId: generalFields.id.messages({
      "string.empty": "ID_REQUIRED",
    }),
    active: Joi.boolean(),
  }).required(),
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const supportIdSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const createCategory = {
  body: Joi.object({
    title_ar: generalFields.name.required(),
    title_en: generalFields.name.optional().allow(""),
    active: Joi.boolean(),
  }).required(),
};

export const updateCategory = {
  body: Joi.object({
    title_ar: generalFields.name,
    title_en: generalFields.name.optional().allow(""),
    active: Joi.boolean(),
  }).required(),
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const categoryIdSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};
