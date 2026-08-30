import * as db from "../../../database/dbService.js";

/**
 * Helper to populate lecture/quiz details for section items
 */
export const populateSectionItems = async (sectionsList) => {
  if (!sectionsList || sectionsList.length === 0) return sectionsList;

  const lectureIds = new Set();
  const quizIds = new Set();

  sectionsList.forEach((sec) => {
    (sec.section_items || []).forEach((item) => {
      const type = (item.item_type || "").toUpperCase();
      if (type === "LECTURE") {
        lectureIds.add(item.item_id);
      } else if (type === "QUIZ") {
        quizIds.add(item.item_id);
      }
    });
  });

  const [lecturesList, quizzesList] = await Promise.all([
    lectureIds.size > 0
      ? db.findMany({
          model: "lectures",
          where: { id: { in: Array.from(lectureIds) } },
        })
      : [],
    quizIds.size > 0
      ? db.findMany({
          model: "quiz",
          where: { id: { in: Array.from(quizIds) } },
          select: {
            id: true,
            title_ar: true,
            title_en: true,
            slug: true,
            description_ar: true,
            description_en: true,
            total_points: true,
            pass_points: true,
            duration_min: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      : [],
  ]);

  const lectureMap = new Map(lecturesList.map((l) => [l.id, l]));
  const quizMap = new Map(quizzesList.map((q) => [q.id, q]));

  return sectionsList.map((sec) => ({
    ...sec,
    section_items: (sec.section_items || []).map((item) => {
      const normalizedType = (item.item_type || "").toUpperCase();
      let details = null;
      if (normalizedType === "LECTURE") {
        details = lectureMap.get(item.item_id) || null;
      } else if (normalizedType === "QUIZ") {
        details = quizMap.get(item.item_id) || null;
      }
      return {
        ...item,
        item_type: normalizedType,
        details,
      };
    }),
  }));
};

export const getSections = async ({ req }) => {
  const { page = 1, limit = 20, course_id, search } = req.query;

  const whereClause = {};
  if (course_id) {
    whereClause.course_id = course_id;
  }
  if (search) {
    whereClause.OR = [
      { name_ar: { contains: search, mode: "insensitive" } },
      { name_en: { contains: search, mode: "insensitive" } },
    ];
  }

  const result = await db.findManyWithPaginationAndCount({
    model: "sections",
    where: whereClause,
    page,
    limit,
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        select: {
          id: true,
          title_ar: true,
          title_en: true,
        },
      },
      section_items: {
        orderBy: { order: "asc" },
      },
    },
  });

  const populatedItems = await populateSectionItems(result.items);

  return {
    ...result,
    items: populatedItems,
  };
};

export const getSectionById = async (id) => {
  const section = await db.findOne({
    model: "sections",
    where: { id },
    include: {
      course: {
        select: {
          id: true,
          title_ar: true,
          title_en: true,
        },
      },
      section_items: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!section) {
    const error = new Error("SECTION_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  const [populated] = await populateSectionItems([section]);
  return populated;
};

export const createSection = async ({ req }) => {
  const { name_ar, name_en, course_id, items } = req.body;

  if (course_id) {
    const courseExists = await db.findOne({
      model: "courses",
      where: { id: course_id },
    });
    if (!courseExists) {
      const error = new Error("COURSE_NOT_FOUND");
      error.status = 404;
      error.isMessageKey = true;
      throw error;
    }
  }

  const createdSection = await db.create({
    model: "sections",
    data: {
      name_ar,
      name_en,
      course_id: course_id || null,
      section_items: items && items.length > 0
        ? {
            create: items.map((item, idx) => ({
              item_id: item.item_id,
              item_type: (item.item_type || "").toUpperCase(),
              order: item.order !== undefined ? item.order : idx + 1,
            })),
          }
        : undefined,
    },
    include: {
      course: {
        select: {
          id: true,
          title_ar: true,
          title_en: true,
        },
      },
      section_items: {
        orderBy: { order: "asc" },
      },
    },
  });

  const [populated] = await populateSectionItems([createdSection]);
  return populated;
};

export const updateSection = async ({ req }) => {
  const { id } = req.params;
  const { name_ar, name_en, course_id, items } = req.body;

  const existingSection = await db.findOne({
    model: "sections",
    where: { id },
  });

  if (!existingSection) {
    const error = new Error("SECTION_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  if (course_id) {
    const courseExists = await db.findOne({
      model: "courses",
      where: { id: course_id },
    });
    if (!courseExists) {
      const error = new Error("COURSE_NOT_FOUND");
      error.status = 404;
      error.isMessageKey = true;
      throw error;
    }
  }

  const updateData = {
    ...(name_ar !== undefined && { name_ar }),
    ...(name_en !== undefined && { name_en }),
    ...(course_id !== undefined && { course_id: course_id || null }),
  };

  if (Array.isArray(items)) {
    await db.transaction(async (tx) => {
      await tx.deleteMany({
        model: "section_items",
        where: { section_id: id },
      });

      await tx.updateOne({
        model: "sections",
        where: { id },
        data: {
          ...updateData,
          section_items: {
            create: items.map((item, idx) => ({
              item_id: item.item_id,
              item_type: (item.item_type || "").toUpperCase(),
              order: item.order !== undefined ? item.order : idx + 1,
            })),
          },
        },
      });
    });
  } else {
    await db.updateOne({
      model: "sections",
      where: { id },
      data: updateData,
    });
  }

  return await getSectionById(id);
};

export const deleteSection = async ({ req }) => {
  const { id } = req.params;

  const existingSection = await db.findOne({
    model: "sections",
    where: { id },
    include:{
      section_items:true,
    }
  });

  if (!existingSection) {
    const error = new Error("SECTION_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  await db.transaction(async (tx) => {
    for (const item of existingSection.section_items) {
      if (item.item_type === "QUIZ") {
        await tx.deleteOne({
          model: "quiz",
          where: { id: item.item_id },
        });
      }

      if (item.item_type === "LECTURE") {
        await tx.deleteOne({
          model: "lectures",
          where: { id: item.item_id },
        });
      }
    }
    await tx.deleteOne({
      model: "sections",
      where: { id },
    });
  });

  return { id };
};

export const addSectionItems = async ({ req }) => {
  const { id } = req.params;
  const { items } = req.body;

  const existingSection = await db.findOne({
    model: "sections",
    where: { id },
  });

  if (!existingSection) {
    const error = new Error("SECTION_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  await db.createMany({
    model: "section_items",
    data: items.map((item, idx) => ({
      section_id: id,
      item_id: item.item_id,
      item_type: (item.item_type || "").toUpperCase(),
      order: item.order !== undefined ? item.order : idx + 1,
    })),
  });

  return await getSectionById(id);
};

export const removeSectionItem = async ({ req }) => {
  const { id, itemId } = req.params;

  const existingSection = await db.findOne({
    model: "sections",
    where: { id },
  });

  if (!existingSection) {
    const error = new Error("SECTION_NOT_FOUND");
    error.status = 404;
    error.isMessageKey = true;
    throw error;
  }

  await db.deleteMany({
    model: "section_items",
    where: {
      section_id: id,
      item_id: itemId,
    },
  });

  return await getSectionById(id);
};
