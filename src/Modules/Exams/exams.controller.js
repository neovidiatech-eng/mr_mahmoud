import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../../Utils/Response.js";
import * as db from "../../database/dbService.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";
import { isAdmin } from "../../Utils/Permissions/permissions.js";
import { localize, localizeMany } from "../../Utils/Localize/index.js";

export const createExam = asyncHandler(async (req, res, next) => {
  const { title_ar, title_en, subject, totalMarks, studentId, status, dueDate, duration } =
    req.body;
  
  // Dynamic RBAC: Check if user has permission to create exams
  // Usually this is handled by authorizeResource("exams") POST => exams:create
  // But here we might need extra checks
  
  const isTeacher = !!req.user.teacher;
  const isManagement = isAdmin(req.user); // If they can read all, they might be management
  
  const teacher = req.user.teacher;
  const student = await db.findOne({
    model: "student",
    where: {
      id: studentId,
    },
  });

  if (!student) {
     return errorResponse({ req, next, message: "STUDENT_NOT_FOUND", status: 404 });
  }

  // If teacher, assign automatically, if admin we might need teacherId passed.
  const assignedTeacherId = teacher?.id || req.body.teacherId;

  if (!assignedTeacherId) {
    return errorResponse({ req, next, message: "MISSING_TEACHER_ID", status: 400 });
  }

  const exam = await db.create({
    model: "exam",
    data: {
      title_ar,
      ...(title_en !== undefined && { title_en }),
      ...(subject !== undefined && { subject }),
      totalMarks,
      studentId,
      status: status || "pending",
      teacherId: assignedTeacherId,
      dueDate,
      duration,
    },
  });
  if (!exam) {
    return errorResponse({
      req,
      next,
      message: "CREATE_FAILED",
      status: 500,
    });
  }

  return successResponse({ res, req, message: "CREATE_SUCCESS", data: exam, status: 201 });
});

export const updateExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title_ar, title_en, subject, totalMarks, dueDate, studentId, teacherId, status, duration } =
    req.body;

  const examExists = await db.findOne({
    model: "exam",
    where: { id },
  });

  if (!examExists) {
    return errorResponse({ req, next, message: "EXAM_NOT_FOUND", status: 404 });
  }

  // Management can update any exam, teachers only their own
  const isManagement = isAdmin(req.user); // Adjust logic as needed
  const isTeacher = !!req.user.teacher;

  if (
    isTeacher && 
    !isManagement &&
    examExists.teacherId !== req.user.teacher?.id
  ) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_UPDATE", status: 403 });
  }

  const exam = await db.updateOne({
    model: "exam",
    where: { id },
    data: {
      ...(title_ar && { title_ar }),
      ...(title_en !== undefined && { title_en }),
      ...(subject !== undefined && { subject }),
      ...(totalMarks !== undefined && { totalMarks }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(studentId && { studentId }),
      ...(teacherId && { teacherId }),
      ...(status && { status }),
      ...(duration !== undefined && { duration }),
    },
  });

  return successResponse({ res, req, message: "UPDATE_SUCCESS", data: exam, status: 200 });
});

export const deleteExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const examExists = await db.findOne({
    model: "exam",
    where: { id },
  });

  if (!examExists) {
    return errorResponse({ req, next, message: "EXAM_NOT_FOUND", status: 404 });
  }

  const isManagement = isAdmin(req.user);
  const isTeacher = !!req.user.teacher;

  // Teacher can only delete their own exams
  if (
    isTeacher &&
    !isManagement &&
    examExists.teacherId !== req.user.teacher?.id
  ) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_DELETE", status: 403 });
  }

  await db.deleteOne({
    model: "exam",
    where: { id },
  });

  return successResponse({
    res,
    req,
    message: "DELETE_SUCCESS",
    status: 200,
  });
});

export const getExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const exam = await db.findOne({
    model: "exam",
    where: { id },
    include: {
      student: { include: { user: true } },
      teacher: { include: { user: true } },
    },
  });

  if (!exam) {
    return errorResponse({ req, next, message: "EXAM_NOT_FOUND", status: 404 });
  }

  const isManagement = isAdmin(req.user);
  const isOwnerTeacher = !!req.user.teacher && exam.teacherId === req.user.teacher.id;
  const isOwnerStudent = !!req.user.student && exam.studentId === req.user.student.id;

  if (!isManagement && !isOwnerTeacher && !isOwnerStudent) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_ACCESS", status: 403 });
  }

  return successResponse({ res, req, message: "FETCH_SUCCESS", data: localize(exam, ["title"], req.lang), status: 200 });
});

export const getStudentExams = asyncHandler(async (req, res, next) => {
  const user = req.user.student || req.user.teacher;
  if (!user) {
    return errorResponse({ req, next, message: "STUDENT_OR_TEACHER_NOT_FOUND", status: 404 });
  }

  const where = {};
  if (req.user.student) {
    where.studentId = req.user.student.id;
  } else if (req.user.teacher) {
    where.teacherId = req.user.teacher.id;
  }

  const exams = await db.findMany({
    model: "exam",
    where,
    include: {
      student: { include: { user: true } },
      teacher: { include: { user: true } },
    },
  });

  if (!exams) {
    return errorResponse({ req, next, message: "EXAM_NOT_FOUND", status: 404 });
  }

  return successResponse({ res, req, message: "FETCH_SUCCESS", data: localizeMany(exams, ["title"], req.lang), status: 200 });
});

export const getAllExams = asyncHandler(async (req, res, next) => {
  const { studentId, teacherId, status, page, limit } = req.query;

  const condition = {};

  if (studentId) condition.studentId = studentId;
  if (teacherId) condition.teacherId = teacherId;
  if (status) condition.status = status;

  // Management can see everything, others see their own
  const isManagement = isAdmin(req.user); 

  if (!isManagement) {
    if (req.user.student) {
      condition.studentId = req.user.student.id;
    } else if (req.user.teacher) {
      condition.teacherId = req.user.teacher.id;
    }
  }

  const { items, pagination } = await db.findManyWithPaginationAndCount({
    model: "exam",
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
    data: { items: localizeMany(items, ["title"], req.lang), pagination },
    status: 200,
  });
});

/* ------------------------------------------------------------------ */
/*                      Question Bank Management                      */
/* ------------------------------------------------------------------ */

const canManageExam = (req, exam) => {
  const isManagement = isAdmin(req.user);
  if (isManagement) return true;
  return !!req.user.teacher && exam.teacherId === req.user.teacher.id;
};

// Deterministic per-exam shuffle: same student sees the same order across
// requests/reloads of the same attempt, but the order itself is randomized
// relative to the teacher-authored `order` field.
const seededShuffle = (array, seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  let state = hash >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const addQuestion = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // examId
  const { text_ar, text_en, type, points, order, options } = req.body;

  const exam = await db.findOne({ model: "exam", where: { id } });
  if (!exam) {
    return errorResponse({ req, next, message: "EXAM_NOT_FOUND", status: 404 });
  }

  if (!canManageExam(req, exam)) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_UPDATE", status: 403 });
  }

  const correctCount = options.filter((o) => o.isCorrect).length;
  if (correctCount !== 1) {
    return errorResponse({ req, next, message: "EXAM_QUESTION_NEEDS_ONE_CORRECT_OPTION", status: 400 });
  }

  let questionOrder = order;
  if (questionOrder === undefined) {
    const lastQuestion = await db.findFirst({
      model: "exam_question",
      where: { examId: id },
      orderBy: { order: "desc" },
    });
    questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
  }

  const question = await db.create({
    model: "exam_question",
    data: {
      examId: id,
      text_ar,
      ...(text_en !== undefined && { text_en }),
      type,
      points,
      order: questionOrder,
      options: {
        create: options.map((o, i) => ({
          text_ar: o.text_ar,
          ...(o.text_en !== undefined && { text_en: o.text_en }),
          isCorrect: !!o.isCorrect,
          order: i,
        })),
      },
    },
    include: { options: true },
  });

  return successResponse({ res, req, message: "CREATE_SUCCESS", data: question, status: 201 });
});

export const updateQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;
  const { text_ar, text_en, type, points, order, options } = req.body;

  const question = await db.findOne({
    model: "exam_question",
    where: { id: questionId },
    include: { exam: true },
  });

  if (!question) {
    return errorResponse({ req, next, message: "EXAM_QUESTION_NOT_FOUND", status: 404 });
  }

  if (!canManageExam(req, question.exam)) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_UPDATE", status: 403 });
  }

  if (options) {
    const correctCount = options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      return errorResponse({ req, next, message: "EXAM_QUESTION_NEEDS_ONE_CORRECT_OPTION", status: 400 });
    }
  }

  const updated = await db.transaction(async (tx) => {
    await tx.updateOne({
      model: "exam_question",
      where: { id: questionId },
      data: {
        ...(text_ar !== undefined && { text_ar }),
        ...(text_en !== undefined && { text_en }),
        ...(type !== undefined && { type }),
        ...(points !== undefined && { points }),
        ...(order !== undefined && { order }),
      },
    });

    if (options) {
      await tx.deleteMany({ model: "exam_option", where: { questionId } });
      for (const [i, o] of options.entries()) {
        await tx.create({
          model: "exam_option",
          data: { questionId, text_ar: o.text_ar, text_en: o.text_en, isCorrect: !!o.isCorrect, order: i },
        });
      }
    }

    return tx.findFirst({
      model: "exam_question",
      where: { id: questionId },
      include: { options: true },
    });
  });

  return successResponse({ res, req, message: "UPDATE_SUCCESS", data: updated, status: 200 });
});

export const deleteQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;

  const question = await db.findOne({
    model: "exam_question",
    where: { id: questionId },
    include: { exam: true },
  });

  if (!question) {
    return errorResponse({ req, next, message: "EXAM_QUESTION_NOT_FOUND", status: 404 });
  }

  if (!canManageExam(req, question.exam)) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_DELETE", status: 403 });
  }

  await db.deleteOne({ model: "exam_question", where: { id: questionId } });

  return successResponse({ res, req, message: "DELETE_SUCCESS", status: 200 });
});

export const getQuestions = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // examId

  const exam = await db.findOne({ model: "exam", where: { id } });
  if (!exam) {
    return errorResponse({ req, next, message: "EXAM_NOT_FOUND", status: 404 });
  }

  const isManagement = isAdmin(req.user);
  const isOwnerTeacher = !!req.user.teacher && exam.teacherId === req.user.teacher.id;
  const isOwnerStudent = !!req.user.student && exam.studentId === req.user.student.id;

  if (!isManagement && !isOwnerTeacher && !isOwnerStudent) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_ACCESS", status: 403 });
  }

  // Students may only reveal correct answers after they've submitted the exam.
  const revealAnswers = isManagement || isOwnerTeacher || ["submitted", "graded"].includes(exam.status);

  const isStudentView = isOwnerStudent && !isManagement && !isOwnerTeacher;

  const questions = await db.findMany({
    model: "exam_question",
    where: { examId: id },
    orderBy: { order: "asc" },
    include: {
      options: true,
      ...(isStudentView ? { answers: { where: { examId: id } } } : {}),
    },
  });

  // Students get a randomized (but per-exam-consistent) question order and
  // per-question option order; teachers/admins always see the authored order.
  const ordered = isStudentView ? seededShuffle(questions, `q-${id}`) : questions;

  const sanitized = ordered.map((q) => {
    const localizedQuestion = localize(q, ["text"], req.lang);
    const localizedOptions = localizeMany(localizedQuestion.options, ["text"], req.lang);
    const options = revealAnswers ? localizedOptions : localizedOptions.map(({ isCorrect, ...rest }) => rest);
    return {
      ...localizedQuestion,
      options: isStudentView ? seededShuffle(options, `o-${id}-${q.id}`) : options,
    };
  });

  return successResponse({ res, req, message: "FETCH_SUCCESS", data: sanitized, status: 200 });
});

/* ------------------------------------------------------------------ */
/*                         Attempt Lifecycle                          */
/* ------------------------------------------------------------------ */

export const startExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const student = req.user.student;

  if (!student) {
    return errorResponse({ req, next, message: "STUDENT_NOT_FOUND", status: 404 });
  }

  const exam = await db.findOne({ model: "exam", where: { id } });
  if (!exam) {
    return errorResponse({ req, next, message: "EXAM_NOT_FOUND", status: 404 });
  }

  if (exam.studentId !== student.id) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_ACCESS", status: 403 });
  }

  if (exam.status === "submitted" || exam.status === "graded") {
    return errorResponse({ req, next, message: "EXAM_ALREADY_SUBMITTED", status: 400 });
  }

  if (new Date() > new Date(exam.dueDate)) {
    return errorResponse({ req, next, message: "EXAM_DUE_DATE_PASSED", status: 400 });
  }

  const updated = await db.updateOne({
    model: "exam",
    where: { id },
    data: {
      status: "in_progress",
      ...(!exam.startedAt && { startedAt: new Date() }),
    },
  });

  return successResponse({ res, req, message: "UPDATE_SUCCESS", data: updated, status: 200 });
});

export const submitExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { answers } = req.body;
  const student = req.user.student;

  if (!student) {
    return errorResponse({ req, next, message: "STUDENT_NOT_FOUND", status: 404 });
  }

  const exam = await db.findOne({
    model: "exam",
    where: { id },
    include: { questions: { include: { options: true } } },
  });

  if (!exam) {
    return errorResponse({ req, next, message: "EXAM_NOT_FOUND", status: 404 });
  }

  if (exam.studentId !== student.id) {
    return errorResponse({ req, next, message: "UNAUTHORIZED_ACCESS", status: 403 });
  }

  if (exam.status === "submitted" || exam.status === "graded") {
    return errorResponse({ req, next, message: "EXAM_ALREADY_SUBMITTED", status: 400 });
  }

  // Enforce the time limit (duration is stored in minutes) from when the attempt started.
  if (exam.startedAt && exam.duration) {
    const deadline = new Date(exam.startedAt.getTime() + exam.duration * 60 * 1000);
    if (new Date() > deadline) {
      return errorResponse({ req, next, message: "EXAM_TIME_LIMIT_EXCEEDED", status: 400 });
    }
  }

  const totalPossible = exam.questions.reduce((sum, q) => sum + q.points, 0);
  let earnedPoints = 0;

  const result = await db.transaction(async (tx) => {
    for (const question of exam.questions) {
      const submitted = answers.find((a) => a.questionId === question.id);
      const selectedOption = submitted?.selectedOptionId
        ? question.options.find((o) => o.id === submitted.selectedOptionId)
        : null;
      const isCorrect = !!selectedOption?.isCorrect;
      if (isCorrect) earnedPoints += question.points;

      await tx.upsertOne({
        model: "exam_answer",
        where: { examId_questionId: { examId: id, questionId: question.id } },
        create: {
          examId: id,
          questionId: question.id,
          selectedOptionId: submitted?.selectedOptionId || null,
          isCorrect,
        },
        update: {
          selectedOptionId: submitted?.selectedOptionId || null,
          isCorrect,
        },
      });
    }

    const grade = totalPossible > 0 ? (earnedPoints / totalPossible) * exam.totalMarks : 0;

    return tx.updateOne({
      model: "exam",
      where: { id },
      data: {
        status: "graded",
        submittedAt: new Date(),
        grade,
      },
    });
  });

  return successResponse({ res, req, message: "EXAM_SUBMITTED", data: result, status: 200 });
});
