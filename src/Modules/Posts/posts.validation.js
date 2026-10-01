import Joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

const postType = Joi.string().valid("blog", "news").messages({
  "any.only": "POST_TYPE_INVALID",
  "string.base": "POST_TYPE_INVALID",
});

export const createPostSchema = {
  body: Joi.object({
    type: postType.required().messages({ "any.required": "POST_TYPE_INVALID" }),
    title_ar: generalFields.name
      .messages({
        "string.base": "TITLE_INVALID",
        "string.empty": "TITLE_INVALID",
        "any.required": "TITLE_REQUIRED",
      })
      .required(),
    title_en: generalFields.name.optional().allow(""),
    excerpt_ar: Joi.string().max(500).allow("", null).optional(),
    excerpt_en: Joi.string().max(500).allow("", null).optional(),
    content_ar: Joi.string().min(1).messages({
      "string.base": "CONTENT_INVALID",
      "string.empty": "CONTENT_REQUIRED",
      "any.required": "CONTENT_REQUIRED",
    }).required(),
    content_en: Joi.string().min(1).allow("").optional(),
    coverImage: Joi.string().optional().allow(null, ""),
    published: Joi.boolean().optional(),
  }).required(),
};

export const updatePostSchema = {
  body: Joi.object({
    type: postType.optional(),
    title_ar: generalFields.name.optional().messages({
      "string.base": "TITLE_INVALID",
      "string.empty": "TITLE_INVALID",
    }),
    title_en: generalFields.name.optional().allow(""),
    excerpt_ar: Joi.string().max(500).allow("", null).optional(),
    excerpt_en: Joi.string().max(500).allow("", null).optional(),
    content_ar: Joi.string().min(1).optional().messages({
      "string.base": "CONTENT_INVALID",
      "string.empty": "CONTENT_REQUIRED",
    }),
    content_en: Joi.string().min(1).allow("").optional(),
    coverImage: Joi.string().optional().allow(null, ""),
    published: Joi.boolean().optional(),
  }).required(),
  params: Joi.object({
    id: generalFields.id
      .messages({ "string.base": "ID_INVALID", "any.required": "ID_REQUIRED" })
      .required(),
  }).required(),
};

export const postIdSchema = {
  params: Joi.object({
    id: generalFields.id
      .messages({ "string.base": "ID_INVALID", "any.required": "ID_REQUIRED" })
      .required(),
  }).required(),
};

export const postSlugSchema = {
  params: Joi.object({
    slug: Joi.string()
      .required()
      .messages({ "string.empty": "SLUG_REQUIRED", "any.required": "SLUG_REQUIRED" }),
  }).required(),
};

export const getPostsSchema = {
  query: Joi.object({
    type: postType.optional(),
    published: Joi.boolean().optional(),
    search: generalFields.search.optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  }).optional(),
};
