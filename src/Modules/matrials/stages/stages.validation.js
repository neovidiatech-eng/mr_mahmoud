import Joi from "joi";
import { generalFields } from "../../../Utils/GeneralFields/index.js";

export const createStageSchema = {
  body: Joi.object().keys({
    name_ar: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .pattern(/^[\u0621-\u064A\s]+$/)
      .required()
      .messages({
        "string.base": "STAGE_NAME_AR_MUST_BE_STRING",
        "string.empty": "STAGE_NAME_AR_CANNOT_BE_EMPTY",
        "string.min": "STAGE_NAME_AR_TOO_SHORT",
        "string.max": "STAGE_NAME_AR_TOO_LONG",
        "string.pattern.base": "STAGE_NAME_AR_INVALID_FORMAT",
        "any.required": "STAGE_NAME_AR_REQUIRED",
      }),

    name_en: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .allow(null)
      .optional()
      .messages({
        "string.base": "STAGE_NAME_EN_MUST_BE_STRING",
        "string.empty": "STAGE_NAME_EN_CANNOT_BE_EMPTY",
        "string.min": "STAGE_NAME_EN_TOO_SHORT",
        "string.max": "STAGE_NAME_EN_TOO_LONG",
      }),


    rankId: generalFields.id
      .required()
      .messages({
        "string.base": "RANK_ID_MUST_BE_STRING",
        "string.empty": "RANK_ID_CANNOT_BE_EMPTY",
        "string.pattern.base": "RANK_ID_MUST_BE_VALID_ID",
        "any.required": "RANK_ID_REQUIRED",
      }),
  }),
};

export const updateStageSchema = {
  params: Joi.object().keys({
    id: generalFields.id.required(),
  }),

  body: Joi.object()
    .keys({
      name_ar: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[\u0621-\u064A\s]+$/)
        .messages({
          "string.base": "STAGE_NAME_AR_MUST_BE_STRING",
          "string.empty": "STAGE_NAME_AR_CANNOT_BE_EMPTY",
          "string.min": "STAGE_NAME_AR_TOO_SHORT",
          "string.max": "STAGE_NAME_AR_TOO_LONG",
          "string.pattern.base": "STAGE_NAME_AR_INVALID_FORMAT",
        }),

      name_en: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .allow(null)
        .messages({
          "string.base": "STAGE_NAME_EN_MUST_BE_STRING",
          "string.empty": "STAGE_NAME_EN_CANNOT_BE_EMPTY",
          "string.min": "STAGE_NAME_EN_TOO_SHORT",
          "string.max": "STAGE_NAME_EN_TOO_LONG",
        }),


      rankId: generalFields.id.messages({
        "string.base": "RANK_ID_MUST_BE_STRING",
        "string.empty": "RANK_ID_CANNOT_BE_EMPTY",
        "string.pattern.base": "RANK_ID_MUST_BE_VALID_ID",
      }),
    })
    .min(1)
    .messages({
      "object.min": "VALIDATION_MIN_ONE_FIELD",
    }),
};
export const getAllStagesSchema = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    rankId: generalFields.id,
  }),
};
export const stageIdSchema = {
  params: Joi.object().keys({
    id: generalFields.id.required(),
  }),
};