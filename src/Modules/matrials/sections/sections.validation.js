import Joi from "joi";
import { generalFields } from "../../../Utils/GeneralFields/index.js";

const sectionItemSchema = Joi.object({
  item_id: generalFields.id.required(),
  item_type: Joi.string().valid("LECTURE", "QUIZ", "lecture", "quiz").required(),
  order: Joi.number().integer().min(0).default(0),
});

export const createSectionSchema = {
  body: Joi.object({
    name_ar: generalFields.name.required(),
    name_en: generalFields.name.optional().allow("", null),
    course_id: generalFields.id.optional().allow("", null),
    items: Joi.array().items(sectionItemSchema).optional(),
  }).required(),
};

export const updateSectionSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    name_ar: generalFields.name.optional(),
    name_en: generalFields.name.optional().allow("", null),
    course_id: generalFields.id.optional().allow("", null),
    items: Joi.array().items(sectionItemSchema).optional(),
  }).required(),
};

export const sectionIdSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const addSectionItemsSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    items: Joi.array().items(sectionItemSchema).min(1).required(),
  }).required(),
};

export const removeSectionItemSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
    itemId: generalFields.id.required(),
  }).required(),
};
