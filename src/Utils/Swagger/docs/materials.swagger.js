export const materialsPaths = {
  "/materials/courses": {
    get: {
      tags: ["Educational Materials - Courses"],
      summary: "Get all courses with optional filters",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "rankId", in: "query", schema: { type: "string" } },
        { name: "categoryId", in: "query", schema: { type: "string" } },
        { name: "title", in: "query", schema: { type: "string" } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1 } },
        { name: "sort", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        { name: "sortBy", in: "query", schema: { type: "string", enum: ["rankId", "createdAt", "title"] } }
      ],
      responses: { 200: { description: "Courses list retrieved." } }
    },
    post: {
      tags: ["Educational Materials - Courses"],
      summary: "Create course (with image thumbnail upload)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["title", "description", "rankId"],
              properties: {
                title: { type: "string", example: "Physics Chapter 1" },
                description: { type: "string", example: "Fundamentals of Motion and Energy" },
                rankId: { type: "string" },
                categoryId: { type: "string" },
                price: { type: "number", example: 199.99 },
                image: { type: "string", format: "binary" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Course created." } }
    }
  },
  "/materials/courses/{id}": {
    get: {
      tags: ["Educational Materials - Courses"],
      summary: "Get course details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Course details retrieved." } }
    },
    patch: {
      tags: ["Educational Materials - Courses"],
      summary: "Update course details",
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
                title: { type: "string" },
                description: { type: "string" },
                rankId: { type: "string" },
                categoryId: { type: "string" },
                price: { type: "number" },
                image: { type: "string", format: "binary" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Course updated." } }
    },
    delete: {
      tags: ["Educational Materials - Courses"],
      summary: "Delete course",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Course deleted." } }
    }
  },
  "/materials/courses/{id}/student-progress": {
    get: {
      tags: ["Educational Materials - Courses"],
      summary: "Get student progress in course lectures",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Course progress retrieved." } }
    }
  },
  "/materials/lectures": {
    get: {
      tags: ["Educational Materials - Lectures"],
      summary: "Get all lectures",
      responses: { 200: { description: "Lectures list retrieved." } }
    },
    post: {
      tags: ["Educational Materials - Lectures"],
      summary: "Create lecture",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "courseId", "videoUrl"],
              properties: {
                title: { type: "string", example: "Lecture 1: Newton Laws" },
                courseId: { type: "string" },
                videoUrl: { type: "string", example: "https://vimeo.com/123456" },
                description: { type: "string" },
                durationSeconds: { type: "integer", example: 3600 }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Lecture created." } }
    }
  },
  "/materials/lectures/{id}": {
    get: {
      tags: ["Educational Materials - Lectures"],
      summary: "Get lecture by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Lecture details retrieved." } }
    },
    patch: {
      tags: ["Educational Materials - Lectures"],
      summary: "Update lecture",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                videoUrl: { type: "string" },
                description: { type: "string" },
                durationSeconds: { type: "integer" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Lecture updated." } }
    },
    delete: {
      tags: ["Educational Materials - Lectures"],
      summary: "Delete lecture",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Lecture deleted." } }
    }
  },
  "/materials/lectures/{id}/complete": {
    post: {
      tags: ["Educational Materials - Lectures"],
      summary: "Mark lecture as completed by student",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Lecture marked as completed." } }
    }
  },
  "/materials/lectures/{id}/progress": {
    patch: {
      tags: ["Educational Materials - Lectures"],
      summary: "Update student lecture watch progress",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["watchedSeconds"],
              properties: {
                watchedSeconds: { type: "number", example: 450 }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Watch progress updated." } }
    }
  },
  "/materials/categories": {
    get: {
      tags: ["Educational Materials - Categories"],
      summary: "Get categories",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "name", in: "query", schema: { type: "string" } }
      ],
      responses: { 200: { description: "Categories list retrieved." } }
    },
    post: {
      tags: ["Educational Materials - Categories"],
      summary: "Create category",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: { name: { type: "string", example: "Physics" } }
            }
          }
        }
      },
      responses: { 201: { description: "Category created." } }
    }
  },
  "/materials/categories/{id}": {
    get: {
      tags: ["Educational Materials - Categories"],
      summary: "Get category by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Category retrieved." } }
    },
    patch: {
      tags: ["Educational Materials - Categories"],
      summary: "Update category",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: { name: { type: "string" } }
            }
          }
        }
      },
      responses: { 200: { description: "Category updated." } }
    },
    delete: {
      tags: ["Educational Materials - Categories"],
      summary: "Delete category",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Category deleted." } }
    }
  },
  "/materials/ranks": {
    get: {
      tags: ["Educational Materials - Ranks"],
      summary: "Get educational ranks",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Ranks list retrieved." } }
    }
  },
  "/materials/ranks/create": {
    post: {
      tags: ["Educational Materials - Ranks"],
      summary: "Create rank",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title"],
              properties: { title: { type: "string", example: "Grade 12 Senior" } }
            }
          }
        }
      },
      responses: { 201: { description: "Rank created." } }
    }
  },
  "/materials/ranks/{id}": {
    get: {
      tags: ["Educational Materials - Ranks"],
      summary: "Get rank by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Rank retrieved." } }
    },
    patch: {
      tags: ["Educational Materials - Ranks"],
      summary: "Update rank",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title"],
              properties: { title: { type: "string" } }
            }
          }
        }
      },
      responses: { 200: { description: "Rank updated." } }
    },
    delete: {
      tags: ["Educational Materials - Ranks"],
      summary: "Delete rank",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Rank deleted." } }
    }
  }
};
