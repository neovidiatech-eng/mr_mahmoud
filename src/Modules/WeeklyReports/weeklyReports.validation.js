import Joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createReportSchema = {
  body: Joi.object({
    weekStarting: Joi.date().required(),
    weekEnding: Joi.date().required(),
    totalClasses: Joi.number().integer().min(0).required(),
    studentsTaught: Joi.number().integer().min(0).required(),
    avgSessionDuration: Joi.number().min(0).required(),
    materialsUploaded: Joi.number().integer().min(0).required(),
    teachingSummary: Joi.string().allow("", null),
    studentProgress: Joi.string().allow("", null),
    challenges: Joi.string().allow("", null),
    overallRating: Joi.number().min(0).max(5).allow(null),
  }).required(),
};

export const updateReportSchema = {
  body: Joi.object({
    weekStarting: Joi.date(),
    weekEnding: Joi.date(),
    totalClasses: Joi.number().integer().min(0),
    studentsTaught: Joi.number().integer().min(0),
    avgSessionDuration: Joi.number().min(0),
    materialsUploaded: Joi.number().integer().min(0),
    teachingSummary: Joi.string().allow("", null),
    studentProgress: Joi.string().allow("", null),
    challenges: Joi.string().allow("", null),
    overallRating: generalFields.number,
  }).required(),
  params: Joi.object({
    id: generalFields.id
      .messages({
        "string.base": "ID_STRING",
        "string.hex": "ID_INVALID",
        "string.length": "ID_INVALID",
        "any.required": "ID_REQUIRED",
        "string.pattern.base": "ID_INVALID",
      })
      .required(),
  }).required(),
};
export const reportIdSchema = {
  params: Joi.object({
    id: generalFields.id
      .messages({
        "string.base": "ID_STRING",
        "string.hex": "ID_INVALID",
        "string.length": "ID_INVALID",
        "any.required": "ID_REQUIRED",
        "string.pattern.base": "ID_INVALID",
      })
      .required(),
  }).required(),
};
export const getMetricsSchema = {
  query: Joi.object({
    weekStarting: Joi.date().required(),
    weekEnding: Joi.date().required(),
  }).required(),
};
