export const sectionsPaths = {
  "/materials/sections": {
    get: {
      tags: ["Educational Materials - Sections"],
      summary: "Get all sections with optional course filter and search",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "course_id", in: "query", schema: { type: "string" }, description: "Filter sections by course ID" },
        { name: "search", in: "query", schema: { type: "string" }, description: "Search section name in Arabic or English" },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, default: 20 } }
      ],
      responses: {
        200: { description: "Sections list retrieved successfully with populated items (lectures/quizzes)." }
      }
    },
    post: {
      tags: ["Educational Materials - Sections"],
      summary: "Create a new section (with optional inline lectures & quizzes)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name_ar"],
              properties: {
                name_ar: { type: "string", example: "السكشن الأول - الأساسيات" },
                name_en: { type: "string", example: "Section 1 - Fundamentals" },
                course_id: { type: "string", example: "course-uuid-here" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["item_id", "item_type"],
                    properties: {
                      item_id: { type: "string", example: "lecture-or-quiz-uuid" },
                      item_type: { type: "string", enum: ["LECTURE", "QUIZ"], example: "LECTURE" },
                      order: { type: "integer", example: 1 }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Section created successfully." }
      }
    }
  },
  "/materials/sections/{id}": {
    get: {
      tags: ["Educational Materials - Sections"],
      summary: "Get section details by ID with populated items (lectures & quizzes)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        200: { description: "Section details retrieved successfully." },
        404: { description: "Section not found." }
      }
    },
    patch: {
      tags: ["Educational Materials - Sections"],
      summary: "Update section details or reorder/update items",
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
                course_id: { type: "string" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["item_id", "item_type"],
                    properties: {
                      item_id: { type: "string" },
                      item_type: { type: "string", enum: ["LECTURE", "QUIZ"] },
                      order: { type: "integer" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Section updated successfully." },
        404: { description: "Section not found." }
      }
    },
    delete: {
      tags: ["Educational Materials - Sections"],
      summary: "Delete section by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        200: { description: "Section deleted successfully." },
        404: { description: "Section not found." }
      }
    }
  },
  "/materials/sections/{id}/items": {
    post: {
      tags: ["Educational Materials - Sections"],
      summary: "Add item(s) (lecture or quiz) to a section",
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
              required: ["items"],
              properties: {
                items: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    required: ["item_id", "item_type"],
                    properties: {
                      item_id: { type: "string" },
                      item_type: { type: "string", enum: ["LECTURE", "QUIZ"] },
                      order: { type: "integer", default: 1 }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Items added to section successfully." },
        404: { description: "Section not found." }
      }
    }
  },
  "/materials/sections/{id}/items/{itemId}": {
    delete: {
      tags: ["Educational Materials - Sections"],
      summary: "Remove an item from a section",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
        { name: "itemId", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        200: { description: "Item removed from section successfully." },
        404: { description: "Section not found." }
      }
    }
  }
};
