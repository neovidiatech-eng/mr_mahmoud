import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";
import * as db from "../../database/dbService.js";
import { localizeResponse } from "../../Utils/Localize/index.js";
import slugify from "slugify";

export const getQuizzes = async ({ req, res, next }) => {
  const { page = 1, limit = 10 } = req.query;
  let canReadAnswers = false;
  if (
    req.user?.role?.name === "admin" ||
    req.user?.role?.name === "super_admin" ||
    req.user?.role?.rolePermissions?.some(p => p.permission?.code === PERMISSIONS_V2.QUIZ.READ_CORRECT_ANSWERS)
  ) {
    canReadAnswers = true;
  }

  const result = await db.findManyWithPaginationAndCount({
    model: "quiz",
    where: {},
    page,
    limit,
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: !canReadAnswers
            ? {
                select: {
                  id: true,
                  question_id: true,
                  createdAt: true,
                  updatedAt: true,
                  option_text_en: true,
                  option_text_ar: true,
                },
              }
            : true,
        },
      },
    },
  });

  return localizeResponse({
    data: result,
    lang: req.lang,
    fields: [],
    removeRaw: true,
  });
};

export const getQuiz = async ({ req, res, next }) => {
  const { id } = req.params;
  let canReadAnswers = false;

  if (
    req.user?.role?.name === "admin" ||
    req.user?.role?.name === "super_admin" ||
    req.user?.role?.rolePermissions?.some(p => p.permission?.code === PERMISSIONS_V2.QUIZ.READ_CORRECT_ANSWERS)
  ) {
    canReadAnswers = true;
  }

  const result = await db.findOne({
    model: "quiz",
    where: { id: id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: !canReadAnswers
            ? {
                select: {
                  id: true,
                  question_id: true,
                  createdAt: true,
                  updatedAt: true,
                  option_text_en: true,
                  option_text_ar: true,
                },
              }
            : true,
        },
      },
    },
  });

  if (!result) {
    const error = new Error("QUIZ_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  return localizeResponse({
    data: result,
    lang: req.lang,
    fields: [],
    removeRaw: true,
  });
};

export const createQuiz = async ({ req, res, next }) => {
  const {
    title_ar,
    title_en,
    description_ar,
    description_en,
    total_points,
    pass_points,
    duration_min,
    courseId,
    questions,
  } = req.body;
  const slugSource = title_en || title_ar;
  const slug =
    slugify(slugSource, { lower: true, replacement: "-", trim: true }) ||
    `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  const exitingQuiz = await db.findOne({
    model: "quiz",
    where: { slug: slug },
  });

  if (exitingQuiz) {
    const error = new Error("QUIZ_EXISTS");
    error.status = 400;
    error.isMessageKey = true;
    throw error;
  }

  const quiz = await db.create({
    model: "quiz",
    data: {
      title_ar,
      title_en: title_en || "",
      slug,
      description_ar: description_ar || "",
      description_en: description_en || "",
      total_points,
      pass_points,
      duration_min,
      ...(courseId && {
        course: {
          connect: {
            id: courseId,
          },
        },
      }),
      questions: {
        create: questions?.map((question, index) => ({
          question_ar: question.question_ar,
          question_en: question.question_en,
          points: question.points,
          type: question.type,
          order: question.order || index + 1,
          options: {
            create: question.options ?? [],
          },
        })),
      },
    },
  });

  return localizeResponse({
    data: quiz,
    lang: req.lang,
    fields: [],
    removeRaw: true,
  });
};

export const updateQuiz = async ({ req, res, next }) => {
  const { id } = req.params;
  const {
    title_ar,
    title_en,
    description_ar,
    description_en,
    total_points,
    pass_points,
    duration_min,
    questions,
  } = req.body;

  const existingQuiz = await db.findOne({
    model: "quiz",
    where: { id },
  });

  if (!existingQuiz) {
    const error = new Error("QUIZ_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  let slug = existingQuiz.slug;
  if (title_ar || title_en) {
    const slugSource = title_en || title_ar || existingQuiz.title_ar;
    slug =
      slugify(slugSource, { lower: true, replacement: "-", trim: true }) ||
      `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const slugCheck = await db.findOne({
      model: "quiz",
      where: { slug, NOT: { id } },
    });

    if (slugCheck) {
      const error = new Error("QUIZ_EXISTS");
      error.status = 400;
      error.isMessageKey = true;
      throw error;
    }
  }

  const updateData = {
    ...(title_ar !== undefined && { title_ar }),
    ...(title_en !== undefined && { title_en }),
    ...(slug && { slug }),
    ...(description_ar !== undefined && { description_ar }),
    ...(description_en !== undefined && { description_en }),
    ...(total_points !== undefined && { total_points }),
    ...(pass_points !== undefined && { pass_points }),
    ...(duration_min !== undefined && { duration_min }),
  };

  if (Array.isArray(questions)) {
    await db.transaction(async (tx) => {
      await tx.deleteMany({
        model: "question",
        where: { quiz_id: id },
      });

      await tx.updateOne({
        model: "quiz",
        where: { id },
        data: {
          ...updateData,
          questions: {
            create: questions.map((q, idx) => ({
              question_ar: q.question_ar,
              question_en: q.question_en,
              points: q.points,
              type: q.type,
              order: q.order || idx + 1,
              options: {
                create: (q.options || []).map((opt) => ({
                  option_text_ar: opt.option_text_ar,
                  option_text_en: opt.option_text_en,
                  is_correct: opt.is_correct ?? false,
                })),
              },
            })),
          },
        },
      });
    });
  } else {
    await db.updateOne({
      model: "quiz",
      where: { id },
      data: updateData,
    });
  }

  const updatedQuiz = await db.findOne({
    model: "quiz",
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: true,
        },
      },
    },
  });

  return localizeResponse({
    data: updatedQuiz,
    lang: req.lang,
    fields: [],
    removeRaw: true,
  });
};

export const deleteQuiz = async ({ req, res, next }) => {
  const { id } = req.params;

  const existingQuiz = await db.findOne({
    model: "quiz",
    where: { id },
  });

  if (!existingQuiz) {
    const error = new Error("QUIZ_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  await db.deleteOne({
    model: "quiz",
    where: { id },
  });

  return { id };
};

export const submitQuiz = async ({ req, res, next }) => {
  const { quiz_id, answers } = req.body;

  const student = await db.findOne({
    model: "student",
    where: { user_id: req.user.id },
  });

  if (!student) {
    const error = new Error("STUDENT_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const quiz = await db.findOne({
    model: "quiz",
    where: { id: quiz_id },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    const error = new Error("QUIZ_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const answerMap = new Map(
    (answers || []).map((a) => [a.question_id, a.option_id])
  );

  let totalScore = 0;
  const answerRecords = [];

  for (const question of quiz.questions) {
    const selectedOptionId = answerMap.get(question.id) || null;
    const selectedOption = question.options.find(
      (opt) => opt.id === selectedOptionId
    );
    const isCorrect = Boolean(selectedOption?.is_correct);
    const points = isCorrect ? question.points : 0;
    totalScore += points;

    answerRecords.push({
      question_id: question.id,
      option_id: selectedOptionId,
      is_correct: isCorrect,
      points,
    });
  }

  const passed = totalScore >= quiz.pass_points;

  const studentQuiz = await db.create({
    model: "studentQuiz",
    data: {
      student_id: student.id,
      quiz_id: quiz.id,
      score: totalScore,
      total_points: quiz.total_points,
      pass_points: quiz.pass_points,
      passed,
      submittedAt: new Date(),
      answers: {
        create: answerRecords,
      },
    },
    include: {
      quiz: {
        select: {
          id: true,
          title_ar: true,
          title_en: true,
          slug: true,
        },
      },
      answers: {
        include: {
          question: true,
          option: true,
        },
      },
    },
  });

  return localizeResponse({
    data: studentQuiz,
    lang: req.lang,
    fields: [],
    removeRaw: true,
  });
};

export const getQuizHistory = async ({ req, res, next }) => {
  const { page = 1, limit = 10, quiz_id } = req.query;

  const student = await db.findOne({
    model: "student",
    where: { user_id: req.user.id },
  });

  const whereClause = {};
  if (student) {
    whereClause.student_id = student.id;
  }
  if (quiz_id) {
    whereClause.quiz_id = quiz_id;
  }

  const result = await db.findManyWithPaginationAndCount({
    model: "studentQuiz",
    where: whereClause,
    page,
    limit,
    orderBy: { createdAt: "desc" },
    include: {
      quiz: {
        select: {
          id: true,
          title_ar: true,
          title_en: true,
          slug: true,
          total_points: true,
          pass_points: true,
        },
      },
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return localizeResponse({
    data: result,
    lang: req.lang,
    fields: [],
    removeRaw: true,
  });
};

export const getQuizAttemptDetails = async ({ req, res, next }) => {
  const { id } = req.params;

  const attempt = await db.findOne({
    model: "studentQuiz",
    where: { id },
    include: {
      quiz: true,
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      answers: {
        include: {
          question: {
            include: {
              options: true,
            },
          },
          option: true,
        },
      },
    },
  });

  if (!attempt) {
    const error = new Error("QUIZ_ATTEMPT_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  return localizeResponse({
    data: attempt,
    lang: req.lang,
    fields: [],
    removeRaw: true,
  });
};
