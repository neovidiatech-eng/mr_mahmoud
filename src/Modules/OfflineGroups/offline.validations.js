import Joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createOfflineGroupSchema = {
  body: Joi.object().keys({
    rankId: generalFields.id
      .messages({
        "string.base": "RANK_ID_MUST_BE_STRING",
        "string.empty": "RANK_ID_CANNOT_BE_EMPTY",
        "string.pattern.base": "RANK_ID_MUST_BE_VALID_ID",
        "any.required": "RANK_ID_REQUIRED",
      })
      .required(),

    courseIds: Joi.array()
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
  params: Joi.object().keys({
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
  params: Joi.object().keys({
    id: generalFields.id
      .messages({
        "string.base": "OFFLINE_GROUP_ID_MUST_BE_STRING",
        "string.empty": "OFFLINE_GROUP_ID_CANNOT_BE_EMPTY",
        "string.pattern.base": "OFFLINE_GROUP_ID_MUST_BE_VALID_ID",
        "any.required": "OFFLINE_GROUP_ID_REQUIRED",
      })
      .required(),
  }),

  body: Joi.object().keys({
    courseIds: Joi.array()
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

    qrActive: Joi.boolean().messages({
      "boolean.base": "IS_ACTIVE_MUST_BE_BOOLEAN",
    }),
  })
    .min(1)
    .messages({
      "object.min": "AT_LEAST_ONE_FIELD_REQUIRED",
    }),
};
