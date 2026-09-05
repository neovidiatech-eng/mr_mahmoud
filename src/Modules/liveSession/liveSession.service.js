import * as db from "../../database/dbService.js";

export const createLiveSession = async ({courseId,userId,stageId,startAt})=>{
    const course = await db.findFirst({
        model:"courses",
        where:{
            id:courseId
        }
    })
    if(!course){
        const error = new Error("COURSE_NOT_FOUND")
        error.isMessageKey = true
        throw error
    }

    const stage = await db.findFirst({
        model:"stage",
        where:{
            id:stageId
        }
    })
    if(!stage){
        const error = new Error("STAGE_NOT_FOUND")
        error.isMessageKey = true
        throw error
    }

    if(course.stageId != stageId){
        const error = new Error ("COURSE_MUST_BE_IN_THE_SAME_STAGE_AS_THE_LIVE_SESSION")
        error.isMessageKey = true
        throw error
    }
    const overlapping = await db.findFirst({
        model:"liveSession",
        where:{
            courseId,
            status:{in:["scheduled","live"]}
        }
    })
    if(overlapping){
        const error = new Error("COURSE_ALREADY_HAS_A_LIVE_SESSION")
        error.isMessageKey = true
        throw error
    }

    const roomName = `live-${course.id}-${stage.id}-${Date.now()}`
    
    const liveSession = await db.create({
        model:"liveSession",
        data:{
            courseId,
            userId,
            stageId,
            startAt,
            roomName,
            status:"scheduled"
        }
    })
    
    return liveSession
    
} 

export const joinLiveSession = async ({liveSessionId , userId})=>{
    const liveSession = await db.findFirst({
        model:"liveSession",
        where:{
            id:liveSessionId
        }
    })
    if(!liveSession){
        const error = new Error("LIVE_SESSION_NOT_FOUND")
        error.isMessageKey = true
        throw error
    }

    if(liveSession.status != "scheduled"){
        const error = new Error("LIVE_SESSION_NOT_SCHEDULED")
        error.isMessageKey = true
        throw error
    }
    

}