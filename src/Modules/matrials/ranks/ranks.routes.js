import { Router } from "express";
import * as controller from "./ranks.controller.js";
import authentication from "../../../Middlewares/Authentication.js";
import { validation } from "../../../Middlewares/Validation.js";
import { authorizeResource } from "../../../Middlewares/AuthorizeResource.js";
import { authorize } from "../../../Middlewares/Authorize.js";
import * as schema from "./ranks.validation.js";
import { PERMISSIONS_V2 } from "../../../Constants/permissions.constants.js";

import { fileValidation, localMulterUpload } from "../../../Utils/Multer/local.multer.js";

const router = Router();

const iconUploader = localMulterUpload({
  customPath: "ranks",
  validation: fileValidation.image,
}).single("icon");

router.get(
  "/",
  controller.getRanks,
);

router.get(
  "/:id",
  

  validation(schema.getRank),
  controller.getRank,
);

router.post(
  "/create",
  authentication,
  iconUploader,
  authorize(PERMISSIONS_V2.RANKS.CREATE),
  validation(schema.createRank),
  controller.addRank,
);

router.patch(
  "/:id",
  authentication,
  iconUploader,
  authorize(PERMISSIONS_V2.RANKS.UPDATE),
  validation(schema.updateRank),
  controller.updateRank,
);

router.delete(
  "/:id",
  authentication,
  authorize(PERMISSIONS_V2.RANKS.DELETE),
  validation(schema.deleteRank),
  controller.deleteRank,
);

export default router;
