import joi from "joi";
import { generalFields } from "../../../Utils/GeneralFields/index.js";

export const getSubjectsSchema = {
  query: joi
    .object({
      search: joi.string().allow("").optional(),
    })
    .optional(),
};

export const getSubjectSchema = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
};

export const createSubjectSchema = {
  body: joi
    .object({
      name_ar: generalFields.name_ar.required(),
      name_en: generalFields.name_en.optional(),
      color: generalFields.color.optional(),
      active: generalFields.active.optional(),
    })
    .required(),
};

export const updateSubjectSchema = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
  body: joi
    .object({
      name_ar: generalFields.name_ar.optional(),
      name_en: generalFields.name_en.optional(),
      color: generalFields.color.optional(),
      active: generalFields.active.optional(),
    })
    .required(),
};

export const deleteSubjectSchema = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
};
