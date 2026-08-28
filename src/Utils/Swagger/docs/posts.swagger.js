export const postsPaths = {
  "/posts": {
    get: {
      tags: ["Posts Management"],
      summary: "Get all published or filterable posts/articles (Public)",
      parameters: [
        { name: "type", in: "query", schema: { type: "string", enum: ["blog", "news"] } },
        { name: "published", in: "query", schema: { type: "boolean" } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, default: 10 } }
      ],
      responses: { 200: { description: "Posts list retrieved successfully." } }
    },
    post: {
      tags: ["Posts Management"],
      summary: "Create new post / article (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["type", "title_ar", "content_ar"],
              properties: {
                type: { type: "string", enum: ["blog", "news"], example: "blog" },
                title_ar: { type: "string", example: "عنوان المقال بالعربية" },
                title_en: { type: "string", example: "Article Title in English" },
                excerpt_ar: { type: "string", example: "نبذة مختصرة عن المقال" },
                excerpt_en: { type: "string", example: "Short article excerpt" },
                content_ar: { type: "string", example: "محتوى المقال التفصيلي..." },
                content_en: { type: "string", example: "Detailed article content..." },
                coverImage: { type: "string", format: "binary", description: "Cover image file" },
                published: { type: "boolean", default: true }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Post created successfully." } }
    }
  },
  "/posts/slug/{slug}": {
    get: {
      tags: ["Posts Management"],
      summary: "Get single post by URL slug (Public)",
      parameters: [
        { name: "slug", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Post details retrieved." } }
    }
  },
  "/posts/{id}": {
    get: {
      tags: ["Posts Management"],
      summary: "Get single post by ID (Admin)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Post details retrieved." } }
    },
    patch: {
      tags: ["Posts Management"],
      summary: "Update post (Admin)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["blog", "news"] },
                title_ar: { type: "string" },
                title_en: { type: "string" },
                excerpt_ar: { type: "string" },
                excerpt_en: { type: "string" },
                content_ar: { type: "string" },
                content_en: { type: "string" },
                coverImage: { type: "string", format: "binary" },
                published: { type: "boolean" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Post updated successfully." } }
    },
    delete: {
      tags: ["Posts Management"],
      summary: "Delete post (Admin)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Post deleted successfully." } }
    }
  }
};
