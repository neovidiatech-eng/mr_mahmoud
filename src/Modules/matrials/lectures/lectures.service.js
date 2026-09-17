import * as db from "../../../database/dbService.js";
import { createError } from "../../../Utils/Helpers.js";
import { isAdmin } from "../../../Utils/Permissions/permissions.js";

/**
 * Resequences all lectures for a given courseId sequentially (1, 2, 3...)
 * Uses a 2-step update (temporary negative orders first) inside a transaction
 * to avoid @@unique([courseId, order]) constraint violations in Prisma/Postgres.
 */
export const resequenceCourseLectures = async (courseId, orderedLectureList, tx = db) => {
  if (!courseId || !orderedLectureList || orderedLectureList.length === 0) return;

  // Step 1: Set temporary negative orders to avoid unique key conflicts
  for (let i = 0; i < orderedLectureList.length; i++) {
    await tx.updateOne({
      model: "lectures",
      where: { id: orderedLectureList[i].id },
      data: { order: -(i + 1000) },
    });
  }

  // Step 2: Set final sequential positive 1-indexed orders
  for (let i = 0; i < orderedLectureList.length; i++) {
    await tx.updateOne({
      model: "lectures",
      where: { id: orderedLectureList[i].id },
      data: { order: i + 1 },
    });
  }
};

/* -----------------------------
   CREATE LECTURE
----------------------------- */
export const createLecture = async ({ req, res, next }) => {
  const { courseId, title_ar, title_en, content_ar, content_en, duration, date, video_path } = req.body;
  let { order } = req.body;

  const slides_path = req.files?.slides?.[0]?.finalPath || req.files?.slides?.[0]?.path || req.body.slides_path || req.body.slidesUrl || null;
  const pdf_path = req.files?.pdf?.[0]?.finalPath || req.files?.pdf?.[0]?.path || req.body.pdf_path || req.body.pdfUrl || null;

  if (!courseId) {
    const error = createError({
      message: "COURSE_ID_REQUIRED",
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

  if (!content_ar) {
    const error = createError({
      message: "DESCRIPTION_REQUIRED",
      status: 400,
      next,
    });
    throw error;
  }

  // check course exists
  const course = await db.findFirst({
    model: "courses",
    where: { id: courseId },
  });

  if (!course) {
    const error = createError({
      message: "COURSE_NOT_FOUND",
      status: 404,
      next,
    });
    throw error;
  }

  return await db.transaction(async (tx) => {
    // Fetch existing lectures for course sorted by order asc
    const existingLectures = await tx.findMany({
      model: "lectures",
      where: { courseId },
      orderBy: { order: "asc" },
    });

    // Create the new lecture with a temporary negative order
    const createdLecture = await tx.create({
      model: "lectures",
      data: {
        courseId,
        title_ar,
        ...(title_en !== undefined && { title_en }),
        content_ar,
        ...(content_en !== undefined && { content_en }),
        video_path,
        slides_path,
        pdf_path,
        order: -99999,
        duration,
        date,
      },
      include: {
        course: {
          select: {
            title_ar: true,
            title_en: true,
          },
        },
      },
    });

    if (!createdLecture) {
      const error = createError({
        message: "CREATE_FAILED",
        status: 500,
        next,
      });
      throw error;
    }

    // Insert newly created lecture into list at target order
    const list = [...existingLectures];
    if (order !== undefined && order !== null && !isNaN(parseInt(order)) && parseInt(order) > 0) {
      const targetIndex = Math.max(0, Math.min(parseInt(order) - 1, list.length));
      list.splice(targetIndex, 0, createdLecture);
    } else {
      list.push(createdLecture);
    }

    // Resequence all lectures in the course sequentially
    await resequenceCourseLectures(courseId, list, tx);

    return await tx.findFirst({
      model: "lectures",
      where: { id: createdLecture.id },
      include: {
        course: {
          select: {
            title_ar: true,
            title_en: true,
          },
        },
      },
    });
  });
};

/* -----------------------------
   GET ALL LECTURES
----------------------------- */
export const getLectures = async ({ req, res, next }) => {
  const { page, limit, courseId } = req.query;

  const where = {};

  if (courseId) {
    where.courseId = courseId;
  }
  const lectures = await db.findManyWithPaginationAndCount({
    model: "lectures",
    where,
    page,
    limit,
    orderBy: { order: "asc" },
  });
  if (!lectures) {
    throw createError({ message: "LECTURE_NOT_FOUND", status: 404, next });
  }

  return lectures;
};

/* -----------------------------
   GET LECTURE BY ID
----------------------------- */
export const getLectureById = async (id, requestingUser) => {
  const lecture = await db.findFirst({
    model: "lectures",
    where: { id },
    include: { course: { select: { id: true, rankId: true } } },
  });

  if (!lecture) {
    const error = new Error("LECTURE_NOT_FOUND");
    error.isMessageKey = true;
    throw error;
  }

  const { hasAccess, myProgress } = await resolveLectureAccess(lecture, requestingUser);

  if (!hasAccess) {
    return {
      ...lecture,
      video_path: null,
      pdf_path: null,
      slides_path: null,
      hasAccess: false,
    };
  }

  return { ...lecture, hasAccess: true, myProgress };
};

/**
 * Determines whether the requesting user can access a lecture's protected
 * content (video/pdf/slides), and returns their saved progress if so.
 * Admins/staff/teachers always have access. Students need either an active
 * subscription matching the course's rank, or a direct course purchase.
 */
const resolveLectureAccess = async (lecture, requestingUser) => {
  if (!requestingUser) return { hasAccess: false, myProgress: null };

  if (isAdmin(requestingUser) || requestingUser.teacher) {
    return { hasAccess: true, myProgress: null };
  }

  const student = requestingUser.student;
  if (!student) return { hasAccess: false, myProgress: null };

  const userLecture = await db.findFirst({
    model: "user_lectures",
    where: { userId: requestingUser.id, lectureId: lecture.id },
  });

  const myProgress = userLecture
    ? {
        status: userLecture.status,
        progress: userLecture.progress,
        lastPosition: userLecture.lastPosition,
      }
    : null;

  const matchesRank = student.rankId === lecture.course?.rankId;
  if (matchesRank) return { hasAccess: true, myProgress };

  const purchase = await db.findFirst({
    model: "CoursePurchase",
    where: { studentId: student.id, courseId: lecture.course?.id },
  });

  return { hasAccess: !!purchase, myProgress };
};

/* -----------------------------
   UPDATE LECTURE
----------------------------- */
export const updateLecture = async ({ req, res, next }) => {
  const { id } = req.params;
  const { courseId, title_ar, title_en, content_ar, content_en, order, duration, date } = req.body;
  const lecture = await db.findFirst({
    model: "lectures",
    where: { id },
  });

  if (!lecture) {
    const error = createError({
      message: "LECTURE_NOT_FOUND",
      status: 404,
      next,
    });
    throw error;
  }

  const newCourseId = courseId || lecture.courseId;
  if (courseId && courseId !== lecture.courseId) {
    const course = await db.findFirst({
      model: "courses",
      where: { id: courseId },
    });

    if (!course) {
      const error = createError({
        message: "COURSE_NOT_FOUND",
        status: 404,
        next,
      });
      throw error;
    }
  }

  const video_path = req.body.video_path || req.body.videoUrl;
  const slides_path = req.files?.slides?.[0]?.finalPath || req.files?.slides?.[0]?.path || req.body.slides_path || req.body.slidesUrl;
  const pdf_path = req.files?.pdf?.[0]?.finalPath || req.files?.pdf?.[0]?.path || req.body.pdf_path || req.body.pdfUrl;

  const data = {
    ...(courseId !== undefined && { courseId }),
    ...(title_ar !== undefined && { title_ar }),
    ...(title_en !== undefined && { title_en }),
    ...(content_ar !== undefined && { content_ar }),
    ...(content_en !== undefined && { content_en }),
    ...(duration !== undefined && { duration }),
    ...(date !== undefined && { date }),
    ...(video_path !== undefined && { video_path }),
    ...(slides_path !== undefined && { slides_path }),
    ...(pdf_path !== undefined && { pdf_path }),
  };

  return await db.transaction(async (tx) => {
    const isCourseChanged = courseId && courseId !== lecture.courseId;
    const isOrderUpdated = order !== undefined && order !== null && !isNaN(parseInt(order));

    if (isCourseChanged) {
      // Move lecture to new course with temporary order -99999
      await tx.updateOne({
        model: "lectures",
        where: { id },
        data: { ...data, order: -99999 },
      });

      // 1. Resequence old course
      const oldCourseLectures = await tx.findMany({
        model: "lectures",
        where: { courseId: lecture.courseId },
        orderBy: { order: "asc" },
      });
      await resequenceCourseLectures(lecture.courseId, oldCourseLectures, tx);

      // 2. Resequence new course
      const newCourseLectures = await tx.findMany({
        model: "lectures",
        where: { courseId: newCourseId, id: { not: id } },
        orderBy: { order: "asc" },
      });

      const list = [...newCourseLectures];
      if (isOrderUpdated && parseInt(order) > 0) {
        const targetIndex = Math.max(0, Math.min(parseInt(order) - 1, list.length));
        list.splice(targetIndex, 0, { id });
      } else {
        list.push({ id });
      }
      await resequenceCourseLectures(newCourseId, list, tx);
    } else if (isOrderUpdated) {
      // Same course, updated order
      await tx.updateOne({
        model: "lectures",
        where: { id },
        data: { ...data, order: -99999 },
      });

      const courseLectures = await tx.findMany({
        model: "lectures",
        where: { courseId: newCourseId, id: { not: id } },
        orderBy: { order: "asc" },
      });

      const list = [...courseLectures];
      const targetIndex = Math.max(0, Math.min(parseInt(order) - 1, list.length));
      list.splice(targetIndex, 0, { id });

      await resequenceCourseLectures(newCourseId, list, tx);
    } else {
      // Normal update without order change
      await tx.updateOne({
        model: "lectures",
        where: { id },
        data,
      });

      // Resequence course to fix any existing gaps/conflicts
      const courseLectures = await tx.findMany({
        model: "lectures",
        where: { courseId: newCourseId },
        orderBy: { order: "asc" },
      });
      await resequenceCourseLectures(newCourseId, courseLectures, tx);
    }

    return await tx.findFirst({
      model: "lectures",
      where: { id },
      include: {
        course: {
          select: {
            title_ar: true,
            title_en: true,
          },
        },
      },
    });
  });
};

/* -----------------------------
   UPDATE WATCH PROGRESS (resume position)
----------------------------- */
export const updateLectureProgress = async ({ req, res, next }) => {
  const { id } = req.params; // lectureId
  const { position, duration } = req.body;
  const userId = req.user.id;

  const lecture = await db.findFirst({ model: "lectures", where: { id } });
  if (!lecture) {
    const error = createError({ message: "LECTURE_NOT_FOUND", status: 404, next });
    throw error;
  }

  const progress = duration ? Math.min(100, (position / duration) * 100) : undefined;
  const isCompleted = progress !== undefined && progress >= 90;

  const userLecture = await db.upsertOne({
    model: "user_lectures",
    where: { userId_lectureId: { userId, lectureId: id } },
    update: {
      lastPosition: position,
      ...(progress !== undefined && { progress }),
      ...(isCompleted && { status: "completed", completedAt: new Date() }),
    },
    create: {
      userId,
      lectureId: id,
      lastPosition: position,
      progress: progress ?? 0,
      status: isCompleted ? "completed" : "in_progress",
      ...(isCompleted && { completedAt: new Date() }),
    },
  });

  return userLecture;
};

/* -----------------------------
   DELETE LECTURE
----------------------------- */
export const deleteLecture = async ({ req, res, next }) => {
  const { id } = req.params;

  const lecture = await db.findFirst({
    model: "lectures",
    where: { id },
  });

  if (!lecture) {
    const error = createError({
      message: "LECTURE_NOT_FOUND",
      status: 404,
      next,
    });
    throw error;
  }

  const { courseId } = lecture;

  return await db.transaction(async (tx) => {
    await tx.deleteOne({
      model: "lectures",
      where: { id },
    });

    const remainingLectures = await tx.findMany({
      model: "lectures",
      where: { courseId },
      orderBy: { order: "asc" },
    });

    await resequenceCourseLectures(courseId, remainingLectures, tx);

    return { id };
  });
};

/* -----------------------------
   REORDER LECTURES
----------------------------- */
export const reorderLectures = async ({ req, res, next }) => {
  const { courseId, lectureIds } = req.body;

  if (!courseId || !Array.isArray(lectureIds)) {
    const error = createError({ message: "INVALID_INPUT", status: 400, next });
    throw error;
  }

  const course = await db.findFirst({
    model: "courses",
    where: { id: courseId },
  });

  if (!course) {
    const error = createError({ message: "COURSE_NOT_FOUND", status: 404, next });
    throw error;
  }

  await db.transaction(async (tx) => {
    const existingLectures = await tx.findMany({
      model: "lectures",
      where: { courseId },
      orderBy: { order: "asc" },
    });

    const lectureMap = new Map(existingLectures.map((l) => [l.id, l]));
    const orderedList = [];

    for (const lid of lectureIds) {
      if (lectureMap.has(lid)) {
        orderedList.push(lectureMap.get(lid));
        lectureMap.delete(lid);
      }
    }

    for (const l of lectureMap.values()) {
      orderedList.push(l);
    }

    await resequenceCourseLectures(courseId, orderedList, tx);
  });

  return await db.findMany({
    model: "lectures",
    where: { courseId },
    orderBy: { order: "asc" },
  });
};

/* -----------------------------
   COMPLETE LECTURE
----------------------------- */
export const completeLecture = async ({ req, res, next }) => {
  const { id } = req.params; // lectureId
  const userId = req.user.id;

  // 1. Check if lecture exists
  const lecture = await db.findFirst({
    model: "lectures",
    where: { id },
  });

  if (!lecture) {
    const error = createError({
      message: "LECTURE_NOT_FOUND",
      status: 404,
      next,
    });
    throw error;
  }

  // Check if student has a free trial / 1 session plan
  const student = await db.findFirst({
    model: "student",
    where: { user_id: userId },
    include: { plan: true },
  });

  if (student) {
    const isFreeTrial = student.sessions === 1 || 
                        student.plan?.price === "0" || 
                        student.plan?.name?.toLowerCase().includes("free") ||
                        student.plan?.name?.toLowerCase().includes("trial") ||
                        student.plan?.sessionsCount === 1;

    if (isFreeTrial) {
      // 1. Check if they have a booked schedule in this course
      const bookedSchedule = await db.findFirst({
        model: "schedule",
        where: {
          studentId: student.id,
          courseId: lecture.courseId,
        },
      });

      if (!bookedSchedule) {
        const error = createError({
          message: "LECTURE_LOCKED",
          status: 403,
          next,
        });
        throw error;
      }

      // 2. Allow completing ONLY the lecture linked to the booked schedule
      //    (if the schedule has a specific lectureId) — or any lecture in the course
      //    if the schedule is a general course booking
      if (bookedSchedule.lectureId && bookedSchedule.lectureId !== id) {
        const error = createError({
          message: "LECTURE_LOCKED",
          status: 403,
          next,
        });
        throw error;
      }
    }
  }

  // 2. Upsert user_lectures
  const userLecture = await db.upsertOne({
    model: "user_lectures",
    where: {
      userId_lectureId: {
        userId,
        lectureId: id,
      },
    },
    update: {
      status: "completed",
      completedAt: new Date(),
    },
    create: {
      userId,
      lectureId: id,
      status: "completed",
      completedAt: new Date(),
    },
  });

  return userLecture;
};


