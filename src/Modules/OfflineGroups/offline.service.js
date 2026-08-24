import crypto from "crypto";
import * as db from "../../database/dbService.js";

export const createGroup = async ({ rankId, courseIds }) => {
  const rank = await db.findFirst({
    model: "ranks",
    where: {
      id: rankId,
    },
  });

  if (!rank) {
    const error = new Error("RANK_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const existingGroup = await db.findFirst({
    model: "offlineGroup",
    where: {
      rankId,
    },
  });

  if (existingGroup) {
    const error = new Error("OFFLINE_GROUP_EXISTS");
    error.status = 409;
    error.isMessageKey = true;
    throw error;
  }

  if (!courseIds?.length) {
    const error = new Error("COURSE_IDS_REQUIRED");
    error.status = 400;
    error.isMessageKey = true;
    throw error;
  }

const uniqueCourseIds = [...new Set(courseIds)];

  const courses = await db.findMany({
    model: "courses",
    where: {
      id: { in: uniqueCourseIds },
    },
  });


  if (courses.length !== uniqueCourseIds.length) {
    const error = new Error("COURSE_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const qrToken = crypto.randomBytes(16).toString("hex");

  return await db.transaction(async (tx) => {
    const group = await tx.create({
      model: "offlineGroup",
      data: {
        rankId,
        qrToken,
      },
    });

    await tx.createMany({
      model: "offlineGroupCourses",
      data: courses.map((course) => ({
        groupId: group.id,
        courseId: course.id,
      })),
    });

    return await tx.findOne({
      model: "offlineGroup",
      where: {
        id: group.id,
      },
      include: {
        rank: true,
        courses: {
          include: {
            course: true,
          },
        },
      },
    });
  });
};

export const getAllgroups = async ()=>{
    return await db.findManyWithPaginationAndCount({
        model: "offlineGroup",
        select: {
        id: true,
        qrToken: true,
        rankId: true,
        createdAt: true,
        rank: true,
         courses: {
             include: {
                 course: true,
         },
         },
     },

        orderBy: {
            createdAt: "desc"
        }
    });
}

export const getGroup = async ({id})=>{
    const group = await db.findOne({
        model:"offlineGroup",
        where:{id},
        select: {
            id: true,
            rank: true,
            rankId: true,
            qrToken: true,
            createdAt: true,
            courses: {
                include: {
                    course: true,
                },
            },
        
        },
    })

    if(!group){
        const error = new Error("OFFLINE_GROUP_NOT_FOUND");
        error.status = 404;
        error.isMessageKey = true;
        throw error;
    }

    return group
}

export const deleteGroup = async ({id})=>{
    const group = await db.findFirst({model:"offlineGroup",where:{id}})
    if(!group){
        const error = new Error("OFFLINE_GROUP_NOT_FOUND");
        error.status = 404;
        error.isMessageKey = true;
        throw error;
    }
    return await db.deleteOne({model:"offlineGroup",where:{id}})
}


export const updateGroup = async ({ id, courseIds, qrActive }) => {
  const group = await db.findFirst({
    model: "offlineGroup",
    where: { id },
  });

  if (!group) {
    const error = new Error("OFFLINE_GROUP_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  let courses;

  if (courseIds !== undefined) {
    const uniqueCourseIds = [...new Set(courseIds)];

    courses = await db.findMany({
      model: "courses",
      where: {
        id: { in: uniqueCourseIds },
      },
    });

    if (courses.length !== uniqueCourseIds.length) {
      const error = new Error("COURSE_NOT_FOUND");
      error.status = 404;
      error.isMessageKey = true;
      throw error;
    }
  }

  return await db.transaction(async (tx) => {
    if (typeof qrActive === "boolean") {
      await tx.updateOne({
        model: "offlineGroup",
        where: { id },
        data: { qrActive },
      });
    }

    if (courses !== undefined) {
      await tx.deleteMany({
        model: "offlineGroupCourses",
        where: { groupId: id },
      });

      if (courses.length > 0) {
        await tx.createMany({
          model: "offlineGroupCourses",
          data: courses.map((course) => ({
            groupId: id,
            courseId: course.id,
          })),
        });
      }
    }

    return await tx.findOne({
      model: "offlineGroup",
      where: { id },
      include: {
        rank: true,
        courses: {
          include: {
            course: true,
          },
        },
      },
    });
  });
};