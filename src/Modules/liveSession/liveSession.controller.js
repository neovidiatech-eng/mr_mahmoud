import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as liveservice from "./liveSession.service.js"

export const createLiveSession = asyncHandler(async(req,res,next)=>{
    const {stageId,courseId,startAt} = req.body
    const userId =req.user.id
    const liveSession = await liveservice.createLiveSession({
        stageId,
        courseId,
        startAt,
        userId
    })
    return successResponse({
        res,
        req,
        message:"CREATE_SUCCESS",
        data:liveSession,
        status:201
    })
})