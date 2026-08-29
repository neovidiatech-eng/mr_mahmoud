import * as db from "../../../database/dbService.js";
import { createError } from "../../../Utils/Helpers.js";

/* -----------------------------
   Shared Includes
----------------------------- */
const lecturesInclude = {
  rank: {
    select: {
      id: true,
      name_ar: true,
      name_en: true,
      slug: true,
      color: true,
    },
  },
  stage:{
    select:{
      id:true,
      name_ar:true,
      name_en:true,
    }
  },
  category: true,
  lectures: {
    orderBy: { order: "asc" },
  },
};

/* -----------------------------
   CREATE COURSE
----------------------------- */
export const createCourse = async ({ req, res, next }) => {
  const { rankId,stageId, title_ar, title_en, description_ar, description_en, categoryId, price, keywords } = req.body;

  if (!rankId) {
    const error = createError({
      message: "RANK_ID_REQUIRED",
      status: 400,
      next,
    });
    throw error;
  }

  if (!title_ar) {
    const error = createError({
      message: "TITLE_REQUIRED",
      status: 400,
      next,
    });
    throw error;
  }

  // check rank exists
  const rank = await db.findFirst({
    model: "ranks",
    where: { id: rankId },
  });

  if (!rank) {
    const error = createError({
      message: "RANK_NOT_FOUND",
      status: 404,
      next,
    });
    throw error;
  }
  // check stage exists
  let stage =null;
  if(stageId){
    stage = await db.findFirst({
      model:"stage",
      where:{id:stageId}
    })
    if(!stage){
      const error = createError({
        message: "STAGE_NOT_FOUND",
        status: 404,
        next,
      });
      throw error;
    }
    if(stage.rankId !== rankId){
      const error = createError({
        message: "STAGE_NOT_BELONG_TO_RANK",
        status: 400,
        next,
      });
      throw error;
    }
  }

  // check title exists
  const courseTitle = await db.findFirst({
    model: "courses",
    where: { title_ar },
  });

  if (courseTitle) {
    const error = createError({
      message: "TITLE_EXISTS",
      status: 409,
      next,
    });
    throw error;
  }
  let image = "";
  if (req.file) {
    image = req?.file?.finalPath || "";
  }

  const course = await db.create({
    model: "courses",
    data: {
      rankId,
      ...(stageId && {stageId:stage.id}),
      title_ar,
      ...(title_en !== undefined && { title_en }),
      description_ar,
      ...(description_en !== undefined && { description_en }),
      image,
      ...(categoryId && { categoryId }),
      ...(price !== undefined && { price: Number(price) }),
      ...(keywords !== undefined && { keywords }),
    },
  });

  return course;
};

/* -----------------------------
   GET ALL COURSES
----------------------------- */
export const getCourses = async (query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const rankId = query.rankId;
  const categoryId = query.categoryId;
  const title = query.title;
  const search = query.search;
  const { sortBy = "createdAt" } = query;
  const sortDirection = query.sort || "desc";


  const where = {};

  if (rankId) {
    where.rankId = rankId;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (title) {
    where.OR = [
      { title_ar: { contains: title, mode: "insensitive" } },
      { title_en: { contains: title, mode: "insensitive" } },
    ];
  }

  // Unified search across name (both languages), description (both languages),
  // keywords, and category name.
  if (search) {
    where.OR = [
      { title_ar: { contains: search, mode: "insensitive" } },
      { title_en: { contains: search, mode: "insensitive" } },
      { description_ar: { contains: search, mode: "insensitive" } },
      { description_en: { contains: search, mode: "insensitive" } },
      { keywords: { has: search } },
      { category: { name_ar: { contains: search, mode: "insensitive" } } },
      { category: { name_en: { contains: search, mode: "insensitive" } } },
    ];
  }

  return await db.findManyWithPaginationAndCount({
    model: "courses",
    where,
    page,
    limit,
    orderBy: [
      { [sortBy]: sortDirection },
    ],
    include: lecturesInclude,
  });
};

/* -----------------------------
   GET COURSE BY ID
----------------------------- */
export const getCourseById = async (id) => {
  const course = await db.findFirst({
    model: "courses",
    where: { id },
    include: lecturesInclude,
  });

  if (!course) {
    const error = new Error("COURSE_NOT_FOUND");
    error.isMessageKey = true;
    throw error;
  }

  return course;
};

/* -----------------------------
   UPDATE COURSE
----------------------------- */
export const updateCourse = async ({ req, res, next }) => {
  const { title_ar, title_en, description_ar, description_en, rankId,stageId, categoryId, price, keywords } = req.body;
  const { id } = req.params;

  // validate title if exists
  if (title_ar) {
    const courseTitle = await db.findFirst({
      model: "courses",
      where: { title_ar, id: { not: id } },
    });

    if (courseTitle) {
      const error = createError({
        message: "TITLE_EXISTS",
        status: 409,
        next,
      });
      throw error;
    }
  }

  const course = await db.findFirst({
    model: "courses",
    where: { id },
  });

  if (!course) {
    const error = createError({
      message: "COURSE_NOT_FOUND",
      status: 404,
      next,
    });
    throw error;
  }
  

  // validate rank change if exists
  if (rankId && rankId !== course.rankId) {
    const rank = await db.findFirst({
      model: "ranks",
      where: { id: rankId },
    });

    if (!rank) {
      const error = createError({
        message: "RANK_NOT_FOUND",
        status: 404,
        next,
      });
      throw error;
    }
  }
  let stage;
  if(stageId !== undefined && stageId !== null && stageId !== course.stageId){
    stage = await db.findFirst({
      model:"stage",
      where:{id:stageId}
    });

    if(!stage){
      const error = createError({
        message:"STAGE_NOT_FOUND",
        status:404,
        next,
      });
      throw error;
    }
    const effectiveRankId = rankId !== undefined ? rankId:course.rankId;
    if(stage.rankId !== effectiveRankId){
      const error = createError({
        message:"STAGE_NOT_BELONG_TO_RANK",
        status:400,
        next,
      });
      throw error;
    }

  }

  return await db.updateOne({
    model: "courses",
    where: { id },
    data: {
      ...(title_ar !== undefined && { title_ar }),
      ...(title_en !== undefined && { title_en }),
      ...(description_ar !== undefined && { description_ar }),
      ...(description_en !== undefined && { description_en }),
      ...(rankId !== undefined && { rankId }),
      ...(stageId !== undefined && {stageId}),
      ...(categoryId !== undefined && { categoryId }),
      ...(price !== undefined && { price: Number(price) }),
      ...(keywords !== undefined && { keywords }),
    },
  });
};



/* -----------------------------
   DELETE COURSE
----------------------------- */
export const deleteCourse = async ({ req, res, next }) => {
  const { id } = req.params;
  const course = await db.findFirst({
    model: "courses",
    where: { id },
  });

  if (!course) {
    const error = createError({
      message: "COURSE_NOT_FOUND",
      status: 404,
      next,
    });
    throw error;
  }

  return await db.deleteOne({
    model: "courses",
    where: { id },
  });
};

/* -----------------------------
   GET COURSE LECTURES FOR STUDENT
----------------------------- */
export const getCourseLecturesForStudent = async ({ req, res, next }) => {
  const { id } = req.params; // courseId
  const userId = req.user.id;

  // 1. Get course and lectures
  const course = await db.findFirst({
    model: "courses",
    where: { id },
    include: {
      lectures: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    const error = createError({
      message: "COURSE_NOT_FOUND",
      status: 404,
      next,
    });
    throw error;
  }

  // 2. Get user's progress for these lectures
  const userLectures = await db.findMany({
    model: "user_lectures",
    where: {
      userId,
      lectureId: { in: course.lectures.map((l) => l.id) },
    },
  });

  // Check if student has a free trial / 1 session plan
  const student = await db.findFirst({
    model: "student",
    where: { user_id: userId },
    include: { plan: true },
  });

  // Course-level access: matching rank subscription OR a direct course purchase.
  // Admins/teachers always pass (this endpoint is student-focused but stays permissive for them).
  let hasCourseAccess = true;
  if (student) {
    const matchesRank = student.active && student.rankId === course.rankId;
    if (!matchesRank) {
      const purchase = await db.findFirst({
        model: "CoursePurchase",
        where: { studentId: student.id, courseId: id },
      });
      hasCourseAccess = !!purchase;
    }
  }

  let isFreeTrial = false;
  let bookedSchedule = null;

  if (student) {
    isFreeTrial = student.sessions === 1 ||
                  student.plan?.price === "0" ||
                  student.plan?.name?.toLowerCase().includes("free") ||
                  student.plan?.name?.toLowerCase().includes("trial") ||
                  student.plan?.sessionsCount === 1;

    if (isFreeTrial) {
      bookedSchedule = await db.findFirst({
        model: "schedule",
        where: {
          studentId: student.id,
          courseId: id,
        },
      });
    }
  }

  // 3. Map lectures to include status
  let foundFirstNonCompleted = false;
  const lecturesWithStatus = course.lectures.map((lecture, index) => {
    const userLecture = userLectures.find((ul) => ul.lectureId === lecture.id);
    let status = "Locked";

    if (!hasCourseAccess) {
      // No rank match and no direct purchase — the whole course stays locked
      // regardless of per-lecture progression.
    } else if (isFreeTrial) {
      // Free trial user logic:
      // - Must have booked a schedule in this course
      // - Only the first lecture (index 0) can be unlocked
      if (bookedSchedule && index === 0) {
        if (userLecture && userLecture.status === "completed") {
          status = "Completed";
        } else {
          status = "Pending";
        }
      }
    } else {
      // Normal progression logic:
      if (userLecture && userLecture.status === "completed") {
        status = "Completed";
      } else if (!foundFirstNonCompleted) {
        status = "Pending";
        foundFirstNonCompleted = true;
      }
    }

    return {
      ...lecture,
      status,
      lastPosition: userLecture?.lastPosition ?? 0,
      ...(status === "Locked" && {
        videoUrl: null,
        pdfUrl: null,
        slidesUrl: null,
        content_ar: null,
        content_en: null,
      }),
    };
  });

  return {
    ...course,
    hasCourseAccess,
    lectures: lecturesWithStatus,
  };
};
