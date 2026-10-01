import joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createOfflineGroupSchema = {
  body: joi.object().keys({
    stageId: generalFields.id
      .messages({
        "string.base": "STAGE_ID_MUST_BE_STRING",
        "string.empty": "STAGE_ID_CANNOT_BE_EMPTY",
        "string.pattern.base": "STAGE_ID_MUST_BE_VALID_ID",
        "any.required": "STAGE_ID_REQUIRED",
      })
      .required(),

    courseIds: joi.array()
      .items(
        generalFields.id.messages({
          "string.base": "COURSE_ID_MUST_BE_STRING",
          "string.empty": "COURSE_ID_CANNOT_BE_EMPTY",
          "string.pattern.base": "COURSE_ID_MUST_BE_VALID_ID",
        })
      )
      .min(1)
      .unique()
      .required()
      .messages({
        "array.base": "COURSE_IDS_MUST_BE_ARRAY",
        "array.min": "AT_LEAST_ONE_COURSE_REQUIRED",
        "array.unique": "COURSE_IDS_MUST_BE_UNIQUE",
        "any.required": "COURSE_IDS_REQUIRED",
      }),
  }),
};

export const offlineGroupIdSchema = {
  params: joi.object().keys({
    id: generalFields.id
      .messages({
        "string.base": "OFFLINE_GROUP_ID_MUST_BE_STRING",
        "string.empty": "OFFLINE_GROUP_ID_CANNOT_BE_EMPTY",
        "string.pattern.base": "OFFLINE_GROUP_ID_MUST_BE_VALID_ID",
        "any.required": "OFFLINE_GROUP_ID_REQUIRED",
      })
      .required(),
  }),
}

export const updateOfflineGroupSchema = {
  params: joi.object().keys({
    id: generalFields.id
      .messages({
        "string.base": "OFFLINE_GROUP_ID_MUST_BE_STRING",
        "string.empty": "OFFLINE_GROUP_ID_CANNOT_BE_EMPTY",
        "string.pattern.base": "OFFLINE_GROUP_ID_MUST_BE_VALID_ID",
        "any.required": "OFFLINE_GROUP_ID_REQUIRED",
      })
      .required(),
  }),

  body: joi.object().keys({
    courseIds: joi.array()
      .items(
        generalFields.id.messages({
          "string.base": "COURSE_ID_MUST_BE_STRING",
          "string.empty": "COURSE_ID_CANNOT_BE_EMPTY",
          "string.pattern.base": "COURSE_ID_MUST_BE_VALID_ID",
        })
      )
      .min(1)
      .unique()
      .messages({
        "array.base": "COURSE_IDS_MUST_BE_ARRAY",
        "array.min": "AT_LEAST_ONE_COURSE_REQUIRED",
        "array.unique": "COURSE_IDS_MUST_BE_UNIQUE",
      }),

    qrActive: joi.boolean().messages({
      "boolean.base": "IS_ACTIVE_MUST_BE_BOOLEAN",
    }),
  })
    .min(1)
    .messages({
      "object.min": "AT_LEAST_ONE_FIELD_REQUIRED",
    }),
};
export const scanOfflineGroupSchema = {
  query: joi.object().keys({
    token: joi.string()
      .trim()
      .required()
      .messages({
        "string.base": "QR_TOKEN_MUST_BE_STRING",
        "string.empty": "QR_TOKEN_CANNOT_BE_EMPTY",
        "any.required": "QR_TOKEN_REQUIRED",
      }),
  }),
};