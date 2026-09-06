import { Router } from "express";
import * as liveController from "./liveSession.controller.js"
import * as schema from "./liveSession.validation.js"
import authentication from "../../Middlewares/Authentication.js";
import { validation } from "../../Middlewares/Validation.js";
import { authorize } from "../../Middlewares/Authorize.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";

const router = Router();


router.post("/",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.CREATE),
    validation(schema.createLiveSessionSchema),
    liveController.createLiveSession
    
)

export default router