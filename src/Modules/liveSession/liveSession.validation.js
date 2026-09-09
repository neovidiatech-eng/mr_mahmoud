import joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";
import { liveSessionsStatus } from "../../Utils/Enums/liveSessions.js";

export const createLiveSessionSchema = {
    body:joi.object().keys({
        stageId:generalFields.id.messages({
            "string.base": "STAGE_ID_MUST_BE_STRING",
            "string.empty": "STAGE_ID_IS_REQUIRED",
            "string.pattern.base":"STAGE_ID_MUST_BE_UUID",
            "any.required":"STAGE_ID_IS_REQUIRED"
        }).required(),
        planId:generalFields.id.messages({
            "string.base": "PLAN_ID_MUST_BE_STRING",
            "string.empty": "PLAN_ID_IS_REQUIRED",
            "string.pattern.base":"PLAN_ID_MUST_BE_UUID",
            "any.required":"PLAN_ID_IS_REQUIRED"
        }).required(),
        startAt:joi.date().required().messages({
            "date.base":"START_AT_MUST_BE_DATE",
            "date.empty":"START_AT_IS_REQUIRED",
            "any.required":"START_AT_IS_REQUIRED"
        }).required(),
        title:joi.string().optional().messages({
            "string.base":"TITLE_MUST_BE_STRING",
            "string.empty":"TITLE_CANNOT_BE_EMPTY"
        })
    })
}

export const liveSessionIdSchema = {
  params: joi.object().keys({
    id: generalFields.id
      .messages({
        "string.base": "LIVE_SESSION_ID_MUST_BE_STRING",
        "string.empty": "LIVE_SESSION_ID_CANNOT_BE_EMPTY",
        "string.pattern.base": "LIVE_SESSION_ID_MUST_BE_VALID_ID",
        "any.required": "LIVE_SESSION_ID_REQUIRED",
      })
      .required(),
  }),
};

export const updateLiveSessionSchema = {
    body:joi.object().keys({
        stageId:generalFields.id.messages({
            "string.base": "STAGE_ID_MUST_BE_STRING",
            "string.empty": "STAGE_ID_IS_REQUIRED",
            "string.pattern.base":"STAGE_ID_MUST_BE_UUID",
            "any.required":"STAGE_ID_IS_REQUIRED"
        }),
        planId:generalFields.id.messages({
            "string.base": "PLAN_ID_MUST_BE_STRING",
            "string.empty": "PLAN_ID_IS_REQUIRED",
            "string.pattern.base":"PLAN_ID_MUST_BE_UUID",
            "any.required":"PLAN_ID_IS_REQUIRED"
        }),
        startAt:joi.date().required().messages({
            "date.base":"START_AT_MUST_BE_DATE",
            "date.empty":"START_AT_IS_REQUIRED",
            "any.required":"START_AT_IS_REQUIRED"
        }),
        title:joi.string().optional().messages({
            "string.base":"TITLE_MUST_BE_STRING",
            "string.empty":"TITLE_CANNOT_BE_EMPTY"
        }),
        status: joi
      .string()
      .valid(...Object.values(liveSessionsStatus))
      .optional()
      .messages({
        "string.base": "STATUS_MUST_BE_STRING",
        "any.only": "INVALID_STATUS",
      })

    })
}