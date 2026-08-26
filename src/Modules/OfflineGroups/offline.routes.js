import { Router } from "express";
import authentication from "../../Middlewares/Authentication.js";
import { authorizeResource } from "../../Middlewares/AuthorizeResource.js";
import { validation } from "../../Middlewares/Validation.js";
import * as schema from "./offline.validations.js";
import * as offlineController from "./offline.controller.js";

const router = Router();
const offlineGroupsResource = "offlinegroups";

router.post(
    "/",
    authentication,
    authorizeResource(offlineGroupsResource),
    validation(schema.createOfflineGroupSchema),
    offlineController.createOfflineGroup
);
router.get("/",
    authentication,
    authorizeResource(offlineGroupsResource),
    offlineController.getAllOfflineGroups
);

router.get(
  "/scan",
  validation(schema.scanOfflineGroupSchema),
  offlineController.scanForOfflineGroup
);

router.get(
    "/:id",
    authentication,
    authorizeResource(offlineGroupsResource),
    validation(schema.offlineGroupIdSchema),
    offlineController.getGroupById
);

router.delete(
    "/:id",
    authentication,
    authorizeResource(offlineGroupsResource),
    validation(schema.offlineGroupIdSchema),
    offlineController.deleteOfflineGroup
);

router.put(
  "/:id",
  authentication,
  authorizeResource(offlineGroupsResource),
  validation(schema.updateOfflineGroupSchema),
  offlineController.updateOfflineGroup
);

export default router;

