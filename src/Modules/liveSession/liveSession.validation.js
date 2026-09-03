import joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createLiveSessionSchema = {
    body:joi.object().keys({
        stageId:generalFields.id.messages({
            "string.base": "STAGE_ID_MUST_BE_STRING",
            "string.empty": "STAGE_ID_IS_REQUIRED",
            "string.pattern.base":"STAGE_ID_MUST_BE_UUID",
            "any.required":"STAGE_ID_IS_REQUIRED"
        }).required(),
        courseId:generalFields.id.messages({
            "string.base": "COURSE_ID_MUST_BE_STRING",
            "string.empty": "COURSE_ID_IS_REQUIRED",
            "string.pattern.base":"COURSE_ID_MUST_BE_UUID",
            "any.required":"COURSE_ID_IS_REQUIRED"
        }).required(),
        startAt:joi.date().required().messages({
            "date.base":"START_AT_MUST_BE_DATE",
            "date.empty":"START_AT_IS_REQUIRED",
            "any.required":"START_AT_IS_REQUIRED"
        }).required(),
        
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