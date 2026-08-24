import { Router } from "express";
import authentication from "../../Middlewares/Authentication";
import { authorizeResource } from "../../Middlewares/AuthorizeResource";
import { validation } from "../../Middlewares/Validation";
import * as offlineValidation from "./offline.validation";
import * as offlineController from "./offline.controller";
import { auth } from "google-auth-library";

const router = Router();
const offlineGroupsResource = "offlinegroups";

router.post(
    "/",
    authentication,
    authorizeResource(offlineGroupsResource),
    validation(offlineValidation.createOfflineGroupSchema),
    offlineController.createOfflineGroup
);
router.get("/",
    authentication,
    authorizeResource(offlineGroupsResource),
    offlineController.getAllOfflineGroups
);

router.get(
    "/:id",
    authentication,
    authorizeResource(offlineGroupsResource),
    validation(offlineValidation.getOfflineGroupSchema),
    offlineController.getGroupById
);

router.delete(
    "/:id",
    authentication,
    authorizeResource(offlineGroupsResource),
    validation(offlineValidation.getOfflineGroupSchema),
    offlineController.deleteOfflineGroup
)

router.put(
  "/:id",
  authentication,
  authorizeResource(offlineGroupsResource),
  validation(offlineValidation.updateOfflineGroupSchema),
  offlineController.updateOfflineGroup
);

export default router;

