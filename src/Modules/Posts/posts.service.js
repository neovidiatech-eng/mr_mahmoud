import * as db from "../../database/dbService.js";

const throwError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  error.isMessageKey = true;
  throw error;
};

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ensureUniqueSlug = async (title, excludeId = null) => {
  const base = slugify(title);
  let slug = base;
  let suffix = 1;

  while (
    await db.findFirst({
      model: "post",
      where: { slug, ...(excludeId && { id: { not: excludeId } }) },
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
};

export const getPosts = async ({ req }) => {
  const { type, published, search, page, limit } = req.query;

  const where = {};
  if (type) where.type = type;
  if (published !== undefined) where.published = published;
  if (search) {
    where.OR = [
      { title_ar: { contains: search, mode: "insensitive" } },
      { title_en: { contains: search, mode: "insensitive" } },
      { excerpt_ar: { contains: search, mode: "insensitive" } },
      { excerpt_en: { contains: search, mode: "insensitive" } },
      { content_ar: { contains: search, mode: "insensitive" } },
      { content_en: { contains: search, mode: "insensitive" } },
    ];
  }

  return await db.findManyWithPaginationAndCount({
    model: "post",
    where,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { id: true, name: true } } },
  });
};

export const getPostBySlug = async ({ req }) => {
  const { slug } = req.params;

  const post = await db.findFirst({
    model: "post",
    where: { slug },
    include: { author: { select: { id: true, name: true } } },
  });

  if (!post) throwError("POST_NOT_FOUND", 404);

  await db.updateOne({
    model: "post",
    where: { id: post.id },
    data: { readingCount: { increment: 1 } },
  });

  return post;
};

export const getPostById = async ({ req }) => {
  const { id } = req.params;

  const post = await db.findOne({
    model: "post",
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });

  if (!post) throwError("POST_NOT_FOUND", 404);

  return post;
};

export const createPost = async ({ req }) => {
  const { type, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, published } = req.body;
  const coverImage = req.file?.finalPath || req.file?.path || req.body.coverImage || null;

  const slug = await ensureUniqueSlug(title_ar);

  return await db.create({
    model: "post",
    data: {
      type,
      title_ar,
      ...(title_en !== undefined && { title_en }),
      slug,
      ...(excerpt_ar !== undefined && { excerpt_ar }),
      ...(excerpt_en !== undefined && { excerpt_en }),
      content_ar,
      ...(content_en !== undefined && { content_en }),
      coverImage,
      published: !!published,
      publishedAt: published ? new Date() : null,
      authorId: req.user.id,
    },
  });
};

export const updatePost = async ({ req }) => {
  const { id } = req.params;
  const { type, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, published } = req.body;
  const coverImage = req.file?.finalPath || req.file?.path || req.body.coverImage;

  const post = await db.findOne({ model: "post", where: { id } });
  if (!post) throwError("POST_NOT_FOUND", 404);

  const data = {
    ...(type !== undefined && { type }),
    ...(title_en !== undefined && { title_en }),
    ...(excerpt_ar !== undefined && { excerpt_ar }),
    ...(excerpt_en !== undefined && { excerpt_en }),
    ...(content_ar !== undefined && { content_ar }),
    ...(content_en !== undefined && { content_en }),
    ...(coverImage !== undefined && { coverImage }),
  };

  if (title_ar !== undefined && title_ar !== post.title_ar) {
    data.title_ar = title_ar;
    data.slug = await ensureUniqueSlug(title_ar, id);
  }

  if (published !== undefined) {
    data.published = published;
    // Only stamp publishedAt the first time a post goes live; keep the
    // original publish date on later edits/unpublish-republish cycles.
    if (published && !post.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  return await db.updateOne({
    model: "post",
    where: { id },
    data,
  });
};

export const deletePost = async ({ req }) => {
  const { id } = req.params;

  const post = await db.findOne({ model: "post", where: { id } });
  if (!post) throwError("POST_NOT_FOUND", 404);

  return await db.deleteOne({ model: "post", where: { id } });
};
