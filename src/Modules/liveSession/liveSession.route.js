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

router.patch("/:id/join",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.JOIN),
    validation(schema.liveSessionIdSchema),
    liveController.joinLiveSession

)
router.get("/",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.READ),
    liveController.getLiveSession
)
router.get("/",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.READ),
    liveController.getAllLiveSessions
)

export default router 