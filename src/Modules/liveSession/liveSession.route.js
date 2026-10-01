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
router.get("/student/upcoming",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.READ),
    validation(schema.getStudentUpcomingLiveSessionsSchema),
    liveController.getStudentUpcomingLiveSessions
)

router.get("/student/next",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.READ),
    liveController.getStudentNextLiveSession
)

router.get("/:id",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.READ),
    validation(schema.liveSessionIdSchema),
    liveController.getLiveSession
)
router.get("/",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.READ),
    liveController.getAllLiveSessions
)
router.delete("/:id",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.DELETE),
    validation(schema.liveSessionIdSchema),
    liveController.deleteLiveSession
)
router.patch("/:id/start",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.START),
    validation(schema.liveSessionIdSchema),
    liveController.startLiveSession
)
router.patch("/:id",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.UPDATE),
    validation(schema.updateLiveSessionSchema),
    liveController.updateLiveSession
)
router.patch("/:id/end",
    authentication,
    authorize(PERMISSIONS_V2.LIVESESSION.END),
    validation(schema.liveSessionIdSchema),
    liveController.endLiveSession
)

export default router 