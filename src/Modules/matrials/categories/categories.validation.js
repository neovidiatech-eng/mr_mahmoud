import joi from "joi";
import { generalFields } from "../../../Utils/GeneralFields/index.js";

export const getCategoriesSchema = {
  query: joi
    .object({
      search: joi.string().allow("").optional(),
    })
    .optional(),
};

export const getCategorySchema = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
};

export const createCategorySchema = {
  body: joi
    .object({
      name_ar: generalFields.name_ar.required(),
      name_en: generalFields.name_en.optional(),
      color: generalFields.color.optional(),
      active: generalFields.active.optional(),
    })
    .required(),
};

export const updateCategorySchema = {
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

export const deleteCategorySchema = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
};
