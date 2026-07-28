import { Router } from "express";
import * as controller from "./coursePurchaseRequests.controller.js";
import { validation } from "../../Middlewares/Validation.js";
import { authorize } from "../../Middlewares/Authorize.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";
import * as schema from "./coursePurchaseRequests.validation.js";

const router = Router();

router.get(
  "/",
  authorize(PERMISSIONS_V2.COURSE_PURCHASE_REQUESTS.READ),
  validation(schema.getRequestsSchema),
  controller.getRequests,
);

router.post(
  "/",
  authorize(PERMISSIONS_V2.COURSE_PURCHASE_REQUESTS.CREATE),
  validation(schema.createRequestSchema),
  controller.createRequest,
);

router.patch(
  "/:id/status",
  authorize(PERMISSIONS_V2.COURSE_PURCHASE_REQUESTS.UPDATE),
  validation(schema.changeStatusSchema),
  controller.changeStatus,
);

export default router;
