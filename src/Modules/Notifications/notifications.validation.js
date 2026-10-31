import Joi from "joi";
import { generalFields } from "../../Utils/GeneralFields/index.js";

export const getNotificationsQuery = {
  query: Joi.object({
    page: generalFields.page.optional().default(1),
    limit: generalFields.limit.optional().default(20),
    isRead: Joi.boolean().optional(),
  }),
};

export const notificationIdParam = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const updateFcmTokenBody = {
  body: Joi.object({
    fcmToken: Joi.string().allow(null, "").optional(),
  }).required(),
};

export const createNotificationBody = {
  body: Joi.object({
    userId: generalFields.id.optional(),
    userIds: Joi.array().items(generalFields.id).optional(),
    type: Joi.string().trim().required(),
    translations: Joi.array()
      .items(
        Joi.object({
          lang: Joi.string().valid("ar", "en").required(),
          title: Joi.string().required(),
          message: Joi.string().required(),
        }),
      )
      .optional(),
    title_ar: Joi.string().optional(),
    title_en: Joi.string().optional(),
    message_ar: Joi.string().optional(),
    message_en: Joi.string().optional(),
  })
    .or("userId", "userIds")
    .required(),
};
