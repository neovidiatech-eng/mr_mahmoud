import crypto from "crypto";
import * as db from "../../database/dbService.js";

export const createGroup = async ({ stageId, courseIds }) => {
  const stage = await db.findFirst({
    model: "stage",
    where: {
      id: stageId,
    },
  });

  if (!stage) {
    const error = new Error("STAGE_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const existingGroup = await db.findFirst({
    model: "offlineGroup",
    where: {
      stageId,
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
        stageId,
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
        stage: true,
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
        stageId: true,
        createdAt: true,
        stage: true,
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
            stage: true,
            stageId: true,
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
        stage: true,
        courses: {
          include: {
            course: true,
          },
        },
      },
    });
  });
};

export const scanGroup = async ({qrToken})=>{
  const group = await db.findOne({
    model:"offlineGroup",
    where:{
      qrToken,
      qrActive: true
    },
    select:{
      id:true,
      courses:{
        include:{
          course:true
        }
      }
    }
  })
  if(!group){
    const error = new Error("GROUP_NOT_FOUND")
    error.isMessageKey = true
    error.status = 404
    throw error
  }

  const scannableCourses = group.courses.map(offlineGroupCourse => ({
    course: {
      id: offlineGroupCourse.course.id,
      name_en: offlineGroupCourse.course.name_en,
      name_ar: offlineGroupCourse.course.name_ar,
    },
  }));

  return scannableCourses;

}