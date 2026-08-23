import joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const createRequestSchema = {
  body: joi
    .object({
      courseId: generalFields.id.optional(),
      name:generalFields.name.required(),
      phone:generalFields.phone.required(),
      email:generalFields.email.required(),
      courseIds: joi.array().items(generalFields.id).min(1).optional(),
      parentPhone: joi.string().max(20).allow("").optional(),
      notes: joi.string().max(1000).allow("").optional(),
    })
    .or("courseId", "courseIds")
    .required(),
};

export const getRequestsSchema = {
  query: joi
    .object({
      status: joi.string().valid("pending", "approved", "rejected").optional(),
      page: joi.number().integer().min(1).optional(),
      limit: joi.number().integer().min(1).optional(),
    })
    .optional(),
};

export const changeStatusSchema = {
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
  body: joi
    .object({
      status: joi.string().valid("approved", "rejected").required(),
      notes: joi.string().max(1000).allow("").optional(),
    })
    .required(),
};
