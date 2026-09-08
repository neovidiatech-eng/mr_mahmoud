import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as liveservice from "./liveSession.service.js"

export const createLiveSession = asyncHandler(async(req,res,next)=>{
    const {stageId,planId,startAt} = req.body
    const userId =req.user.id
    const liveSession = await liveservice.createLiveSession({
        stageId,
        planId,
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

export const joinLiveSession = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const userId = req.user.id
    const isTeacher = req.user.role?.name === "teacher";

    const result = await liveservice.joinLiveSession({
        liveSessionId:id,
        userId,
        isTeacher
    })
    return successResponse({
        req,
        res,
        status:200,
        message:"LIVE_SESSION_JOIN_SUCCESS",
        data:result
    })
})

export const getLiveSession = asyncHandler(async(req,res,next)=>{
    const {id}= req.params;

    const liveSession = await liveservice.getLiveSession({liveSessionId:id})

    return successResponse({
        req,
        res,
        status:200,
        message:"FETCH_SUCCESS",
        data:liveSession
    })


})
export const getAllLiveSessions = asyncHandler(async(req,res,next)=>{
    const {page,limit}= req.query
    const liveSessions = await liveservice.getAllLiveSessions({page,limit})
    return successResponse({
        req,
        res,
        status:200,
        message:"FETCH_SUCCESS",
        data:liveSessions
    })
})
