import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../../Utils/Response.js";
import * as db from "../../database/dbService.js";
import { isAdmin, ROLES } from "../../Utils/Permissions/permissions.js";
import { localize, localizeMany } from "../../Utils/Localize/index.js";

const isHomeworkManagementUser = (user) =>
  isAdmin(user) || user?.role?.name === ROLES.STAFF;

export const createHomework = asyncHandler(async (req, res, next) => {
  const { title_ar, title_en, description_ar, description_en, dueDate, studentId, subjectId, status } = req.body;

  const userId = req.user.userId;
  const student = await db.findOne({
    model: "student",
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return errorResponse({
      req,
      next,
      message: "STUDENT_NOT_FOUND",
      status: 404,
    });
  }

  const assignedUserId = userId || req.body.userId;

  if (!assignedUserId) {
    return errorResponse({
      req,
      next,
      message: "MISSING_USER_ID",
      status: 400,
    });
  }

  const homework = await db.create({
    model: "homework",
    data: {
      title_ar,
      ...(title_en !== undefined && { title_en }),
      description_ar,
      ...(description_en !== undefined && { description_en }),
      dueDate: new Date(dueDate),
      studentId,
      ...(subjectId && { subjectId }),
      status: status || "pending",
      userId: assignedUserId,
    },
  });

  return successResponse({
    res,
    req,
    message: "CREATE_SUCCESS",
    data: homework,
    status: 201,
  });
});

export const updateHomework = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title_ar, title_en, description_ar, description_en, dueDate, studentId, subjectId, grade, feedback, status } =
    req.body;

  const homeworkExists = await db.findOne({
    model: "homework",
    where: { id },
  });

  if (!homeworkExists) {
    return errorResponse({
      req,
      next,
      message: "HOMEWORK_NOT_FOUND",
      status: 404,
    });
  }


  let finalDueDate = dueDate;
  if (dueDate) {
    finalDueDate = new Date(dueDate);
  }

  // Grading a submitted homework moves it to "graded" unless the caller
  // explicitly requests a different status.
  const finalStatus = status || (grade !== undefined ? "graded" : undefined);

  const homework = await db.updateOne({
    model: "homework",
    where: { id },
    data: {
      ...(title_ar && { title_ar }),
      ...(title_en !== undefined && { title_en }),
      ...(description_ar && { description_ar }),
      ...(description_en !== undefined && { description_en }),
      ...(finalDueDate && { dueDate: finalDueDate }),
      ...(studentId && { studentId }),
      ...(subjectId && { subjectId }),
      ...(grade !== undefined && { grade }),
      ...(feedback !== undefined && { feedback }),
      ...(finalStatus && { status: finalStatus }),
    },
  });

  return successResponse({
    res,
    req,
    message: "UPDATE_SUCCESS",
    data: homework,
    status: 200,
  });
});

export const deleteHomework = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const homeworkExists = await db.findOne({
    model: "homework",
    where: { id },
  });

  if (!homeworkExists) {
    return errorResponse({
      req,
      next,
      message: "HOMEWORK_NOT_FOUND",
      status: 404,
    });
  }

  

  await db.deleteOne({
    model: "homework",
    where: { id },
  });

  return successResponse({
    res,
    req,
    message: "DELETE_SUCCESS",
    status: 200,
  });
});

export const getHomework = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const homework = await db.findOne({
    model: "homework",
    where: { id },
    include: {
      student: { include: { user: true } },
    },
  });

  if (!homework) {
    return errorResponse({
      req,
      next,
      message: "HOMEWORK_NOT_FOUND",
      status: 404,
    });
  }


  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: localize(homework, ["title", "description"], req.lang),
    status: 200,
  });
});

export const getStudentHomework = asyncHandler(async (req, res, next) => {
  const student = req.user.student;
  if (!student) {
    return errorResponse({
      req,
      next,
      message: "STUDENT_NOT_FOUND",
      status: 404,
    });
  }

  const homework = await db.findMany({
    model: "homework",
    where: { studentId: student?.id },
    include: {
      student: { include: { user: true } },
    },
  });

  if (!homework) {
    return errorResponse({
      req,
      next,
      message: "HOMEWORK_NOT_FOUND",
      status: 404,
    });
  }

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: localizeMany(homework, ["title", "description"], req.lang),
    status: 200,
  });
});

export const getAllHomework = asyncHandler(async (req, res, next) => {
  const { studentId, status, page, limit } = req.query;

  const condition = {};

  if (studentId) condition.studentId = studentId;
  if (status) condition.status = status;

  const isManagement = isHomeworkManagementUser(req.user);

  if (!isManagement && req.user.student) {
    condition.studentId = req.user.student.id;
  }


  const { items, pagination } = await db.findManyWithPaginationAndCount({
    model: "homework",
    where: condition,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    include: {
      student: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: { items: localizeMany(items, ["title", "description"], req.lang), pagination },
    status: 200,
  });
});
export const getTeacherHomeworks = asyncHandler(async (req, res, next) => {
  const { studentId, page, limit } = req.query;
  const teacher = req.user.teacher.id;
  if (!teacher) {
    return errorResponse({
      req,
      next,
      message: "TEACHER_NOT_FOUND",
      status: 404,
    });
  }

  const condition = {};

  if (studentId) condition.studentId = studentId;
  if (teacher) condition.teacherId = teacher;

  const { items, pagination } = await db.findManyWithPaginationAndCount({
    model: "homework",
    where: condition,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    include: {
      student: { include: { user: { select: { name: true, email: true } } } },
      teacher: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: { items: localizeMany(items, ["title", "description"], req.lang), pagination },
    status: 200,
  });
});

export const submitHomework = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const student = req.user.student;

  if (!student) {
    return errorResponse({
      req,
      next,
      message: "STUDENT_NOT_FOUND",
      status: 404,
    });
  }

  const homeworkExists = await db.findOne({
    model: "homework",
    where: { id, studentId: student.id , status:"pending"},
  });

  if (!homeworkExists) {
    return errorResponse({
      req,
      next,
      message: "HOMEWORK_NOT_FOUND",
      status: 404,
    });
  }

  // Handle file uploads
  if (req.multerError) {
    return errorResponse({
      req,
      next,
      message: req.multerError,
      status: 400,
    });
  }

  const attachments = [];

  if (req.file) {
    const file = req.file;
    attachments.push({
      path: file.finalPath,
      name: file.originalname,
      mimetype: file.mimetype,
    });
  }

  if (attachments.length === 0) {
    return errorResponse({
      req,
      next,
      message: "NO_FILES_UPLOADED",
      status: 400,
    });
  }

  const updatedHomework = await db.updateOne({
    model: "homework",
    where: { id },
    data: {
      attachments,
      status: "submitted",
    },
  });

  return successResponse({
    res,
    req,
    message: "SUBMIT_SUCCESS",
    data: updatedHomework,
    status: 200,
  });
});
