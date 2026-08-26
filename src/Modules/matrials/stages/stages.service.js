import * as db from "../../../database/dbService.js";
import slugify from "slugify";

export const createStage = async ({ name_ar, name_en, rankId }) => {
  const rank = await db.findFirst({ model: "ranks", where: { id: rankId } });
  if (!rank) {
    const error = new Error("RANK_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }
  const slugSource = name_en || name_ar;
  if (!slugSource) {
    const error = new Error("NAME_REQUIRED");
    error.status = 400;
    error.isMessageKey = true;
    throw error;
  }
  const slug = slugify(slugSource, { lower: true, replacement: "-", trim: true }) 
               || `stage-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
 
 
  const existingStage = await db.findFirst({
    model: "stage",
    where: { slug },
  });
  if (existingStage) {
    const error = new Error("STAGE_ALREADY_EXISTS");
    error.status = 409;
    error.isMessageKey = true;
    throw error;
  }
 
  return await db.create({
    model: "stage",
    data: {
      name_ar,
      ...(name_en !== undefined && { name_en }),
      slug,
      rankId,
    },
    select: {
      id: true,
      name_ar: true,
      name_en: true,
      slug: true,
      rankId: true,
      rank: true,
    },
  });
};

    



export const getAllStages = async ({ page, limit, rankId } = {}) => {
  const where = rankId ? { rankId } : {};
 
  return await db.findManyWithPaginationAndCount({
    model: "stage",
    where,
    limit: Number(limit) || 10,
    page: Number(page) || 1,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name_ar: true,
      name_en: true,
      slug: true,
      rankId: true,
      rank: true,
    },
  });
};

export const getStageById = async({id})=>{
    const stage = await db.findOne({
        model:"stage",
        where:{id},
        select:{
            id: true,
            name_ar: true,
            name_en: true,
            slug: true,
            rankId: true,
            rank: true,
        }
    })
    if (!stage) {
        const error = new Error("STAGE_NOT_FOUND");
        error.status = 404;
        error.isMessageKey = true;
        throw error;
    }

    return stage;
    
}

export const updateStage = async ({
    id,
    name_ar,
    name_en,
    rankId
})=>{
    const stage = await db.findOne({
        model:"stage",
        where:{id}
    })
    if(!stage){
        const error = new Error("STAGE_NOT_FOUND");
        error.status = 404;
        error.isMessageKey = true;
        throw error;
    }

    if (rankId !== undefined && rankId !== stage.rankId) {
    const rank = await db.findFirst({
      model: "ranks",
      where: { id: rankId },
    });

    if (!rank) {
      const error = new Error("RANK_NOT_FOUND");
      error.status = 404;
      error.isMessageKey = true;
      throw error;
      }
  }
  const data = {}
  if (name_ar !== undefined) data.name_ar = name_ar;
  if (name_en !== undefined) data.name_en = name_en;
  if (rankId !== undefined) data.rankId = rankId;

    if (name_ar !== undefined || name_en !== undefined) {
  const finalNameAr =
    name_ar !== undefined ? name_ar : stage.name_ar;

  const finalNameEn =
    name_en !== undefined ? name_en : stage.name_en;

  const slugSource = finalNameEn || finalNameAr;

  const slug =
      slugify(slugSource, { lower: true, replacement: "-", trim: true }) ||
      `stage-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;


  const existingStage = await db.findFirst({
    model: "stage",
    where: {
      slug,
      NOT: {
        id,
      },
    },
  });

  if (existingStage) {
    const error = new Error("STAGE_ALREADY_EXISTS");
    error.status = 409;
    error.isMessageKey = true;
    throw error;
  }

  data.slug = slug;
}

    return await db.updateOne({
        model:"stage",
        where:{id},
        data,
        select:{
            id: true,
            name_ar: true,
            name_en: true,
            slug: true,
            rankId: true,
            rank: true,
        }
    })
}

export const deleteStage = async ({ id }) => {
  const stage = await db.findFirst({
    model: "stage",
    where: { id },
  });
  if (!stage) {
    const error = new Error("STAGE_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const [studentsCount, coursesCount, offlineGroup] = await Promise.all([
    db.count({ model: "student", where: { stageId: id } }),
    db.count({ model: "courses", where: { stageId: id } }),
    db.findFirst({ model: "offlineGroup", where: { stageId: id } }),
  ]);

  if (studentsCount > 0) {
    const error = new Error("STAGE_HAS_STUDENTS");
    error.status = 409;
    error.isMessageKey = true;
    throw error;
  }

  if (coursesCount > 0) {
    const error = new Error("STAGE_HAS_COURSES");
    error.status = 409;
    error.isMessageKey = true;
    throw error;
  }

  if (offlineGroup) {
    const error = new Error("STAGE_HAS_OFFLINE_GROUP");
    error.status = 409;
    error.isMessageKey = true;
    throw error;
  }

  await db.deleteOne({
    model: "stage",
    where: { id },
  });

  return stage;
};