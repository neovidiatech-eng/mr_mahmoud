import Joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createPolicySchema = {
  body: Joi.object({
    title_ar: Joi.string().required(),
    title_en: Joi.string().allow("").optional(),
    description_ar: Joi.string().required(),
    description_en: Joi.string().allow("").optional(),
    icon: Joi.string().allow("", null),
    color: Joi.string().allow("", null),
    lastUpdated: Joi.date(),
    active: Joi.boolean(),
  }).required(),
};

export const updatePolicySchema = {
  body: Joi.object({
    title_ar: Joi.string(),
    title_en: Joi.string().allow(""),
    description_ar: Joi.string(),
    description_en: Joi.string().allow(""),
    icon: Joi.string().allow("", null),
    color: Joi.string().allow("", null),
    lastUpdated: Joi.date(),
    active: Joi.boolean(),
  }).required(),
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const policyIdSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const createNoticeSchema = {
  body: Joi.object({
    title_ar: Joi.string().required(),
    title_en: Joi.string().allow("").optional(),
    content_ar: Joi.string().required(),
    content_en: Joi.string().allow("").optional(),
    active: Joi.boolean(),
  }).required(),
};

export const updateNoticeSchema = {
  body: Joi.object({
    title_ar: Joi.string(),
    title_en: Joi.string().allow(""),
    content_ar: Joi.string(),
    content_en: Joi.string().allow(""),
    active: Joi.boolean(),
  }).required(),
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};
