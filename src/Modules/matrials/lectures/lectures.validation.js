import Joi from "joi";
import { generalFields } from "../../../Utils/GeneralFields/index.js";

export const createLectureSchema = {
  body: Joi.object({
    title_ar: generalFields.name
      .messages({
        "string.base": "TITLE_INVALID",
        "string.empty": "TITLE_INVALID",
        "any.required": "TITLE_REQUIRED",
      })
      .required(),
    title_en: generalFields.name.optional().allow(""),
    content_ar: generalFields.description
      .messages({
        "string.base": "DESCRIPTION_INVALID",
        "string.empty": "DESCRIPTION_INVALID",
        "any.required": "DESCRIPTION_REQUIRED",
      })
      .required(),
    content_en: generalFields.description.optional().allow(""),
    video_path: Joi.string().allow("", null).required(),
    slides_path: Joi.string().allow("", null).optional(),
    pdf_path: Joi.string().allow("", null).optional(),
    order: generalFields.number.optional(),
    courseId: generalFields.id.required(),
    duration: Joi.string().optional(),
    date: Joi.date().optional(),
  }).required(),
};

export const updateLectureSchema = {
  body: Joi.object({
    title_ar: generalFields.name,
    title_en: generalFields.name.optional().allow(""),
    content_ar: generalFields.description,
    content_en: generalFields.description.optional().allow(""),
    videoUrl: Joi.string().allow("", null).optional(),
    slidesUrl: Joi.string().allow("", null).optional(),
    pdfUrl: Joi.string().allow("", null).optional(),
    video_path: Joi.string().allow("", null).optional(),
    slides_path: Joi.string().allow("", null).optional(),
    pdf_path: Joi.string().allow("", null).optional(),
    order: generalFields.number,
    courseId: generalFields.id,
    duration: Joi.string().optional(),
    date: Joi.date().optional(),
  }).required(),
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const lectureIdSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const updateProgressSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    position: Joi.number().min(0).required(),
    duration: Joi.number().min(0).optional(),
  }).required(),
};
