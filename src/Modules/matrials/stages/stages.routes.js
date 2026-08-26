import { Router } from "express";
import authentication from "../../../Middlewares/Authentication.js";
import { authorizeResource } from "../../../Middlewares/AuthorizeResource.js";
import { validation } from "../../../Middlewares/Validation.js";
import * as schema from "./stages.validation.js"
import * as stagecontroller from "./stages.controller.js"



const router = Router();

const stageResource = "stage";

router.post("/",
    authentication,
    authorizeResource(stageResource),
    validation(schema.createStageSchema),
    stagecontroller.createStage
);

router.get("/",
    authentication,
    authorizeResource(stageResource),
    validation(schema.getAllStagesSchema),
    stagecontroller.getAllStages
    
)
router.get("/:id",
    authentication,
    authorizeResource(stageResource),
    validation(schema.stageIdSchema),
    stagecontroller.getStageById
)
router.patch(
  "/:id",
  authentication,
  authorizeResource(stageResource),
  validation(schema.updateStageSchema),
  stagecontroller.updateStage
);
router.delete(
  "/:id",
  authentication,
  authorizeResource(stageResource),
  validation(schema.stageIdSchema),
  stagecontroller.deleteStage,
);
export default router;
