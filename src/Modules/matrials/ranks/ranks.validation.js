import joi from "joi";
import { generalFields } from "../../../Utils/GeneralFields/index.js";

export const createRank = {
  body: joi.object({
    name_ar: generalFields.name
      .messages({
        "any.required": "MISSING_NAME",
        "string.empty": "NAME_EMPTY",
        "string.base": "NAME_STRING",
      })
      .required(),
    name_en: generalFields.name.optional().allow(""),
    color: generalFields.color
      .messages({
        "any.required": "COLOR_REQUIRED",
        "string.empty": "COLOR_EMPTY",
        "string.base": "COLOR_STRING",
      })
      .required(),
    icon: joi.string().optional().allow("", null),
  }),
};

export const updateRank = {
  body: joi.object({
    name_ar: generalFields.name
      .messages({
        "string.empty": "NAME_EMPTY",
        "string.base": "NAME_STRING",
      })
      .optional(),
    name_en: generalFields.name.optional().allow(""),
    color: generalFields.color
      .messages({
        "string.empty": "COLOR_EMPTY",
        "string.base": "COLOR_STRING",
      })
      .optional(),
    icon: joi.string().optional().allow("", null),
  }),
  params: joi.object({
    id: generalFields.id.required(),
  }),
};

export const deleteRank = {
  params: joi.object({
    id: generalFields.id.required(),
  }),
};

export const getRank = {
  params: joi.object({
    id: generalFields.id.required(),
  }),
};
