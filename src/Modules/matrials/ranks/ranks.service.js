import * as db from "../../../database/dbService.js";

/* -----------------------------
   Constants & Shared Includes
----------------------------- */
const nestedInclude = {
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
  const { name_ar, name_en, color, ageRange, stageName_ar, stageName_en } = req.body || {};
  const slug = name_ar
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const check = await db.findFirst({
    model: "ranks",
    where: {
      OR: [{ name_ar }, { slug }]
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
      ...(stageName_ar !== undefined && { stageName_ar }),
      ...(stageName_en !== undefined && { stageName_en }),
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
  const { name_ar, name_en, color, ageRange, stageName_ar, stageName_en } = req.body;

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
  if (name_ar) {
    const slug = name_ar
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const check = await db.findFirst({
      model: "ranks",
      where: {
        id: { not: id },
        OR: [{ name_ar }, { slug }]
      },
    });

    if (check) {
      const error = new Error("RANK_EXISTS");
      error.status = 400;
      error.isMessageKey = true;
      throw error;
    }

    updateData.name_ar = name_ar;
    updateData.slug = slug;
  }
  if (name_en !== undefined) updateData.name_en = name_en;

  if (color) updateData.color = color;
  if (ageRange) updateData.ageRange = ageRange;
  if (stageName_ar !== undefined) updateData.stageName_ar = stageName_ar;
  if (stageName_en !== undefined) updateData.stageName_en = stageName_en;

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

  const [coursesCount, studentsCount] = await Promise.all([
    db.count({ model: "courses", where: { rankId: id } }),
    db.count({ model: "student", where: { rankId: id } }),
  ]);

  if (coursesCount > 0 || studentsCount > 0) {
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
