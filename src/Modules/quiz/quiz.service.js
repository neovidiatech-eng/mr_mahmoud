import * as db from "../../database/dbService.js";
import { localizeResponse } from "../../Utils/Localize/index.js";
import slugify from "slugify";

export const getQuizzes = async ({ req, res, next }) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await db.findManyWithPaginationAndCount({
    model: "quiz",
    where: {},
    page,
    limit,
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: true
        },
      },
    },
  });

  return localizeResponse({data: result, lang: req.lang,fields:[],removeRaw:true});
};
export const getQuiz = async ({ req, res, next }) => {
  const { id } = req.params;

  const result = await db.findOne({
    model: "quiz",
    where: { id: id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: true,
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

  return localizeResponse({ data: result, lang: req.lang, fields: [], removeRaw: true });
};
export const createQuiz = async ({ req, res, next }) => {
  const { title_ar, title_en, description_ar, description_en, total_points, pass_points, duration_min, questions } = req.body;
  const slugSource = title_en || title_ar;
  const slug = slugify(slugSource, { lower: true, replacement: "-", trim: true }) 
               || `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
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
    title_en,
    slug,
    description_ar,
    description_en,
    total_points,
    pass_points,
    duration_min,

    questions: {
      create: questions?.map((question, index) => ({
        question_ar: question.question_ar,
        question_en: question.question_en,
        points: question.points,
        type: question.type,
        order: index + 1,

        options: {
          create: question.options ?? [],
        },
      })),
    },
  },
});
return localizeResponse({data: quiz, lang: req.lang,fields:[],removeRaw:true});
};
