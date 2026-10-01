export const materialsPaths = {
  "/materials/courses": {
    get: {
      tags: ["Educational Materials - Courses"],
      summary: "Get all courses with optional filters (Public)",
      parameters: [
        { name: "rankId", in: "query", schema: { type: "string", format: "uuid" }, description: "Filter by rank ID" },
        { name: "stageId", in: "query", schema: { type: "string", format: "uuid" }, description: "Filter by stage ID" },
        { name: "categoryId", in: "query", schema: { type: "string", format: "uuid" }, description: "Filter by category ID" },
        { name: "title", in: "query", schema: { type: "string" } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, default: 10 } },
        { name: "sort", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        { name: "sortBy", in: "query", schema: { type: "string", enum: ["rankId", "createdAt", "title_ar"] } }
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
              required: ["title_ar", "description_ar", "rankId"],
              properties: {
                title_ar: { type: "string", example: "الفيزياء - الفصل الأول" },
                title_en: { type: "string", example: "Physics - Chapter 1" },
                description_ar: { type: "string", example: "أساسيات الحركة والطاقة" },
                description_en: { type: "string", example: "Fundamentals of Motion and Energy" },
                rankId: { type: "string", format: "uuid" },
                stageId: { type: "string", format: "uuid" },
                categoryId: { type: "string", format: "uuid" },
                price: { type: "number", example: 199.99 },
                keywords: { type: "array", items: { type: "string" }, description: "Search keywords (max 20)" },
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
      summary: "Get course details by ID (Public)",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      responses: { 200: { description: "Course details retrieved." } }
    },
    patch: {
      tags: ["Educational Materials - Courses"],
      summary: "Update course details",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title_ar: { type: "string" },
                title_en: { type: "string" },
                description_ar: { type: "string" },
                description_en: { type: "string" },
                rankId: { type: "string", format: "uuid" },
                stageId: { type: "string", format: "uuid" },
                categoryId: { type: "string", format: "uuid" },
                price: { type: "number" },
                keywords: { type: "array", items: { type: "string" } },
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
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      responses: { 200: { description: "Course deleted." } }
    }
  },
  "/materials/courses/{id}/student-progress": {
    get: {
      tags: ["Educational Materials - Courses"],
      summary: "Get student progress in course with section gating & progression",
      description: "Returns course details with section-by-section gating progression (`sections` with `section_items` and item status: `Completed`, `Pending`, `Passed`, `Failed`, `Available`, `Locked`) as well as flat `lectures` with watch status.",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      responses: { 200: { description: "Course progress and section gating progression retrieved." } }
    }
  },
  "/materials/lectures": {
    get: {
      tags: ["Educational Materials - Lectures"],
      summary: "Get all lectures (Public)",
      responses: { 200: { description: "Lectures list retrieved." } }
    },
    post: {
      tags: ["Educational Materials - Lectures"],
      summary: "Create lecture (with file uploads or paths)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["title_ar", "content_ar", "courseId"],
              properties: {
                title_ar: { type: "string", example: "المحاضرة الأولى: قوانين نيوتن" },
                title_en: { type: "string", example: "Lecture 1: Newton's Laws" },
                content_ar: { type: "string", example: "شرح كامل لقوانين نيوتن للحركة" },
                content_en: { type: "string", example: "Full explanation of Newton's laws of motion" },
                courseId: { type: "string", format: "uuid" },
                order: { type: "number", example: 1 },
                duration: { type: "string", example: "01:00:00" },
                date: { type: "string", format: "date-time" },
                video: { type: "string", format: "binary", description: "Lecture video file upload" },
                slides: { type: "string", format: "binary", description: "Lecture slides file upload" },
                pdf: { type: "string", format: "binary", description: "Lecture PDF notes file upload" },
                video_path: { type: "string", description: "Direct video file path" },
                slides_path: { type: "string", description: "Direct slides file path" },
                pdf_path: { type: "string", description: "Direct PDF file path" },
                videoUrl: { type: "string", description: "External video URL" },
                slidesUrl: { type: "string", description: "External slides URL" },
                pdfUrl: { type: "string", description: "External PDF URL" }
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
      summary: "Get lecture by ID (Public)",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      responses: { 200: { description: "Lecture details retrieved." } }
    },
    patch: {
      tags: ["Educational Materials - Lectures"],
      summary: "Update lecture",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title_ar: { type: "string" },
                title_en: { type: "string" },
                content_ar: { type: "string" },
                content_en: { type: "string" },
                order: { type: "number" },
                courseId: { type: "string", format: "uuid" },
                duration: { type: "string" },
                date: { type: "string", format: "date-time" },
                video: { type: "string", format: "binary" },
                slides: { type: "string", format: "binary" },
                pdf: { type: "string", format: "binary" },
                video_path: { type: "string" },
                slides_path: { type: "string" },
                pdf_path: { type: "string" },
                videoUrl: { type: "string" },
                slidesUrl: { type: "string" },
                pdfUrl: { type: "string" }
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
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
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
              required: ["position"],
              properties: {
                position: { type: "number", example: 450 },
                duration: { type: "number", example: 3600 }
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
        { name: "search", in: "query", schema: { type: "string" } }
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
              required: ["name_ar"],
              properties: {
                name_ar: { type: "string", example: "الفيزياء" },
                name_en: { type: "string", example: "Physics" },
                color: { type: "string", example: "#FF5733" },
                active: { type: "boolean", default: true }
              }
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
              properties: {
                name_ar: { type: "string" },
                name_en: { type: "string" },
                color: { type: "string" },
                active: { type: "boolean" }
              }
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
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["name_ar", "color"],
              properties: {
                name_ar: { type: "string", example: "الصف الثالث الثانوي" },
                name_en: { type: "string", example: "Grade 12 Senior" },
                color: { type: "string", example: "#3357FF" },
                icon: { type: "string", format: "binary", description: "Rank icon image" }
              }
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
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name_ar: { type: "string" },
                name_en: { type: "string" },
                color: { type: "string" },
                icon: { type: "string", format: "binary" }
              }
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
