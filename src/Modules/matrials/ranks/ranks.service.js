import * as db from "../../../database/dbService.js";
import slugify from "slugify";

/* -----------------------------
   Constants & Shared Includes
----------------------------- */
const nestedInclude = {
  stages: true,
  courses: {
    include: {
      lectures: {
        orderBy: { order: "asc" }
      }
    }
  }
};

/* -----------------------------
   GET ALL RANKS
----------------------------- */
export const getRanks = async (req, res, next) => {
  const { name, page, limit } = req.query || {};
  const where = {};
  if (name) {
    where.OR = [
      { name_ar: { contains: name, mode: "insensitive" } },
      { name_en: { contains: name, mode: "insensitive" } },
    ];
  }

  return await db.findManyWithPaginationAndCount({
    model: "ranks",
    where,
    limit: Number(limit) || 10,
    page: Number(page) || 1,
    orderBy: { name_ar: "asc" },
    include: nestedInclude
  });
};

/* -----------------------------
   ADD RANK
----------------------------- */
export const addRank = async (req, res, next) => {
  const { name_ar, name_en, color, ageRange } = req.body || {};
  
  const slugSource = name_en || name_ar;
  if (!slugSource) {
    const error = new Error("NAME_REQUIRED");
    error.status = 400;
    error.isMessageKey = true;
    throw error;
  }

  const slug = slugify(slugSource, { lower: true, replacement: "-", trim: true }) 
               || `rank-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  const check = await db.findFirst({
    model: "ranks",
    where: {
      OR: [
        { name_ar },
        ...(name_en ? [{ name_en }] : []),
        { slug }
      ]
    },
  });

  if (check) {
    const error = new Error("RANK_EXISTS");
    error.status = 400;
    error.isMessageKey = true;
    throw error;
  }

  return await db.create({
    model: "ranks",
    data: {
      name_ar,
      ...(name_en !== undefined && { name_en }),
      slug,
      color,
      ageRange,
      
    },
  });
};

/* -----------------------------
   GET RANK BY ID
----------------------------- */
export const getRank = async (req, res, next) => {
  const { id } = req.params;
  const rank = await db.findFirst({
    model: "ranks",
    where: { id },
    include: nestedInclude
  });

  if (!rank) {
    const error = new Error("RANK_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  return rank;
};

/* -----------------------------
   UPDATE RANK
----------------------------- */
export const updateRank = async (req, res, next) => {
  const { id } = req.params;
  const { name_ar, name_en, color, ageRange } = req.body;

  const rank = await db.findFirst({
    model: "ranks",
    where: { id },
  });

  if (!rank) {
    const error = new Error("RANK_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const updateData = {};
  let shouldRegenerateSlug = false;
  let targetNameEn = name_en !== undefined ? name_en : rank.name_en;
  let targetNameAr = name_ar !== undefined ? name_ar : rank.name_ar;

  if (name_ar !== undefined && name_ar !== rank.name_ar) {
    const checkAr = await db.findFirst({
      model: "ranks",
      where: {
        id: { not: id },
        name_ar,
      },
    });

    if (checkAr) {
      const error = new Error("RANK_EXISTS");
      error.status = 400;
      error.isMessageKey = true;
      throw error;
    }

    updateData.name_ar = name_ar;
    shouldRegenerateSlug = true;
  }

  if (name_en !== undefined && name_en !== rank.name_en) {
    if (name_en) {
      const checkEn = await db.findFirst({
        model: "ranks",
        where: {
          id: { not: id },
          name_en,
        },
      });

      if (checkEn) {
        const error = new Error("RANK_EXISTS");
        error.status = 400;
        error.isMessageKey = true;
        throw error;
      }
    }

    updateData.name_en = name_en;
    shouldRegenerateSlug = true;
  }

  if (shouldRegenerateSlug) {
    const slugSource = targetNameEn || targetNameAr;
    const slug = slugify(slugSource || "", { lower: true, replacement: "-", trim: true }) 
                 || `rank-${id}`;

    const checkSlug = await db.findFirst({
      model: "ranks",
      where: {
        id: { not: id },
        slug,
      },
    });

    if (checkSlug) {
      const error = new Error("RANK_EXISTS");
      error.status = 400;
      error.isMessageKey = true;
      throw error;
    }

    updateData.slug = slug;
  }

  if (color) updateData.color = color;
  if (ageRange) updateData.ageRange = ageRange;

  return await db.updateOne({
    model: "ranks",
    where: { id },
    data: updateData,
  });
};

/* -----------------------------
   DELETE RANK
----------------------------- */
export const deleteRank = async (req, res, next) => {
  const { id } = req.params;

  const rank = await db.findFirst({
    model: "ranks",
    where: { id },
  });

  if (!rank) {
    const error = new Error("RANK_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const [coursesCount, studentsCount,stagesCount] = await Promise.all([
    db.count({ model: "courses", where: { rankId: id } }),
    db.count({ model: "student", where: { rankId: id } }),
    db.count({ model: "stages", where: { rankId: id } }),
  ]);

  if (coursesCount > 0 || studentsCount > 0 || stagesCount > 0) {
    const error = new Error("RANK_IN_USE");
    error.status = 409;
    error.isMessageKey = true;
    throw error;
  }

  return await db.deleteOne({
    model: "ranks",
    where: { id },
  });
};
