import * as db from "../../database/dbService.js";
import { liveSessionsStatus } from "../../Utils/Enums/liveSessions.js";
import { generateJitsiToken } from "../../Utils/Token/jitsiToken.js";

export const createLiveSession = async ({planId,userId,stageId,startAt,title})=>{
    const [plan,stage] = await Promise.all([
        db.findFirst({
            model:"plan",
            where:{
                id:planId
            }
        }),
        db.findFirst({
            model:"stage",
            where:{
                id:stageId
            }
        })
    ])
    if(!plan){
        const error = new Error("PLAN_NOT_FOUND")
        error.isMessageKey = true
        throw error
    }

    if(!stage){
        const error = new Error("STAGE_NOT_FOUND")
        error.isMessageKey = true
        throw error
    }
    

    const roomName = `live-${Date.now().toString(36)}`    

    const liveSession = await db.create({
        model:"liveSession",
        data:{
            planId,
            userId,
            stageId,
            startAt,
            roomName,
            title,
            status:liveSessionsStatus.SCHEDULED
        }
    })
    
    return liveSession
    
} 

export const joinLiveSession = async ({ liveSessionId, userId }) => {
  const liveSession = await db.findFirst({
    model: "liveSession",
    where: { id: liveSessionId },
  });
  if (!liveSession) {
    const error = new Error("LIVE_SESSION_NOT_FOUND");
    error.isMessageKey = true;
    throw error;
  }

  if (liveSession.status === liveSessionsStatus.ENDED || liveSession.status === liveSessionsStatus.CANCELLED) {
    const error = new Error("LIVE_SESSION_ENDED");
    error.isMessageKey = true;
    throw error;
  }

    const requester = await db.findFirst({
    model: "user",
    where: { id: userId },
    include:{
      role:true
    }
  });
  if(!requester){
    const error = new Error("USER_NOT_FOUND");
    error.isMessageKey = true;
    throw error;
 
  }

  const isOwner = liveSession.userId === userId
  let isModerator = false;
  let studentRecord = null;

  if (isOwner) {
    isModerator = true;
  } else {
    studentRecord = await db.findFirst({
      model: "student",
      where: {
        user_id: userId,
        planId: liveSession.planId,
        stageId: liveSession.stageId,
      },
    });
    if (!studentRecord) {
      const error = new Error("YOU_ARE_NOT_AUTHORIZED_TO_JOIN_THIS_LIVE_SESSION");
      error.isMessageKey = true;
      throw error;
    }

    const existingAttendance = await db.findFirst({
      model: "liveSessionAttendances",
      where: {
        liveSessionId: liveSession.id,
        studentId: studentRecord.id,
      },
    });

    if (!existingAttendance) {
      const plan = await db.findFirst({
        model: "plan",
        where: { id: liveSession.planId },
      });
      if (!plan) {
        const error = new Error("PLAN_NOT_FOUND");
        error.isMessageKey = true;
        throw error;
      }

      if (studentRecord.attendedLiveSessions >= plan.liveSessionsCount) {
        const error = new Error("LIVE_SESSIONS_LIMIT_REACHED");
        error.isMessageKey = true;
        throw error;
      }

      await db.create({
        model: "liveSessionAttendances",
        data: {
          liveSessionId: liveSession.id,
          studentId: studentRecord.id,
        },
      });

      await db.updateOne({
        model: "student",
        where: { id: studentRecord.id },
        data: { attendedLiveSessions: { increment: 1 } },
      });
    }
  }

  

  const token = generateJitsiToken({
    userId:requester.id,
    roomName: liveSession.roomName,
    userName: requester.name,
    userEmail: requester.email,
    isModerator,
  });

  return { token, roomName: liveSession.roomName };
};

export const getLiveSession = async({liveSessionId})=>{
  const liveSession = await db.findFirst({
    model:"liveSession",
    where:{
      id:liveSessionId,
    },
    include:{
      plan:true,
      stage:true
    }
  });
  if(!liveSession){
    const error = new Error("LIVE_SESSION_NOT_FOUND")
    error.isMessageKey=true
    throw error
  }

  return liveSession
}

export const getAllLiveSessions = async({page , limit,search })=>{
  const where ={}
  if(search){
    where.title = {
      contains:search,
      mode: "insensitive",
    }
  }
  const result = await db.findManyWithPaginationAndCount({
    model:"liveSession",
    page:Number(page)||1,
    limit:Number(limit)||10,
    orderBy:{
      startAt:"desc",
    },
    include:{
      plan:true,
      stage:true
    }
  })
  return result
}

export const deleteLiveSession = async({liveSessionId})=>{
  const liveSession = await db.findFirst({
    model:"liveSession",
    where:{
      id:liveSessionId
    }
  })
  if(!liveSession){
    const error = new Error ("LIVE_SESSION_NOT_FOUND")
    error.isMessageKey = true
    throw error
  }
  if(liveSession.status === liveSessionsStatus.LIVE){
    const error = new Error ("LIVE_SESSION_CANNOT_BE_DELETED")
    error.isMessageKey = true
    throw error
  }
  return await db.deleteOne({
    model:"liveSession",
    where:{
      id:liveSessionId
    }
  })
}


export const startLiveSession = async({liveSessionId,userId})=>{
  const liveSession = await db.findFirst({
    model:"liveSession",
    where:{
      id:liveSessionId,
    }
  })
  if(!liveSession){
    const error = new Error ("LIVE_SESSION_NOT_FOUND")
    error.isMessageKey = true
    throw error
  }
  if(liveSession.userId !== userId){
    const error = new Error ("YOU_ARE_NOT_AUTHORIZED_TO_START_THIS_LIVE_SESSION")
    error.isMessageKey = true
    throw error
  }
  if(liveSession.status === liveSessionsStatus.LIVE){
    const error = new Error ("LIVE_SESSION_ALREADY_STARTED")
    error.isMessageKey = true
    throw error
  }
  if (liveSession.status === liveSessionsStatus.ENDED || liveSession.status === liveSessionsStatus.CANCELLED) {
    const error = new Error("LIVE_SESSION_ENDED");
    error.isMessageKey = true;
    throw error;
  }

  const updatedLiveSession = await db.updateOne({
    model:"liveSession",
    where:{id:liveSessionId},
    data:{
      status:liveSessionsStatus.LIVE,
    }
  })
  return updatedLiveSession
}

export const updateLiveSession = async({liveSessionId,userId,planId,stageId,startAt,title,status})=>{
  const liveSession = await db.findFirst({
    model:"liveSession",
    where:{
      id:liveSessionId
    }
  })
  if(!liveSession){
    const error = new Error("LIVE_SESSION_NOT_FOUND")
    error.isMessageKey=true
    throw error
  }
  if(liveSession.userId !== userId){
    const error = new Error("YOU_ARE_NOT_AUTHORIZED_TO_UPDATE_THIS_LIVE_SESSION")
    error.isMessageKey=true
    throw error
  }
  
  if(liveSession.status !== liveSessionsStatus.SCHEDULED){
    const error = new Error("LIVE_SESSION_CANNOT_BE_UPDATED")
    error.isMessageKey=true
    throw error
  }
  if(planId){
    const plan = await db.findFirst({
      model:"plan",
      where:{
        id:planId
      }
    })
    if(!plan){
      const error = new Error("PLAN_NOT_FOUND")
      error.isMessageKey=true
      throw error
    }
  }

  if(stageId){
    const stage = await db.findFirst({
      model:"stage",
      where:{
        id:stageId,
        
      }
    })
    if(!stage){
      const error = new Error("STAGE_NOT_FOUND")
      error.isMessageKey=true
      throw error
    } 
  }
  if(status){
    const allowedStatus = [
      liveSessionsStatus.SCHEDULED,
      liveSessionsStatus.CANCELLED,
      liveSessionsStatus.LIVE,
      liveSessionsStatus.COMPLETED
    ]
    if(!allowedStatus.includes(status)){
      const error = new Error("INVALID_STATUS")
      error.isMessageKey = true
      throw error
    }
    

  }
  const updatedLiveSession = await db.updateOne({
    model:"liveSession",
    where:{id:liveSessionId},
    data:{
      ...planId && {planId},
      ...stageId && {stageId},
      ...startAt && {startAt},
      ...title && {title},
      ...status && {status}
    }
  })
  return updatedLiveSession


}
  
export const endLiveSession = async ({liveSessionId,userId})=>{
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
  if(liveSession.userId !== userId){
    const error = new Error("YOU_ARE_NOT_AUTHORIZED_TO_END_THIS_LIVE_SESSION")
    error.isMessageKey = true
    throw error
  }
  if(liveSession.status ===  liveSessionsStatus.ENDED || liveSession.status === liveSessionsStatus.CANCELLED){
    const error = new Error("LIVE_SESSION_ALREADY_ENDED_OR_CANCELLED")
    error.isMessageKey = true
    throw error
  }
  
  const updatedLiveSession = await db.updateOne({
    model:"liveSession",
    where:{
      id:liveSessionId
    },
    data:{
      status:liveSessionsStatus.ENDED,
      endedAt:new Date()
    }
  })
  return updatedLiveSession
}