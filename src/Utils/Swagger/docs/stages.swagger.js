export const stagesPaths = {
  "/materials/stages": {
    get: {
      tags: ["Educational Materials - Stages"],
      summary: "Get all educational stages with pagination & filters",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "rankId", in: "query", schema: { type: "string", format: "uuid" }, description: "Filter stages by rank ID" }
      ],
      responses: {
        200: {
          description: "Stages list retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "STAGES_FETCHED_SUCCESSFULLY" },
                  data: {
                    type: "object",
                    properties: {
                      stages: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", format: "uuid" },
                            name_ar: { type: "string", example: "المرحلة الثانوية" },
                            name_en: { type: "string", example: "Secondary Stage" },
                            slug: { type: "string", example: "secondary-stage" },
                            rankId: { type: "string", format: "uuid" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                            rank: { type: "object" }
                          }
                        }
                      },
                      pagination: { type: "object" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ["Educational Materials - Stages"],
      summary: "Create educational stage for a rank",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name_ar", "rankId"],
              properties: {
                name_ar: {
                  type: "string",
                  example: "المرحلة الأولى",
                  description: "Arabic stage name (2-100 characters)"
                },
                name_en: {
                  type: "string",
                  example: "Stage One",
                  description: "English stage name (optional, 2-100 characters)"
                },
                rankId: {
                  type: "string",
                  format: "uuid",
                  example: "45f94b32-9c16-43b3-8d07-c5ef547781b1",
                  description: "Parent Educational Rank ID"
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Stage created successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "STAGE_CREATED_SUCCESSFULLY" },
                  data: { type: "object" }
                }
              }
            }
          }
        },
        400: { description: "Validation error." },
        404: { description: "Rank not found." },
        409: { description: "Stage already exists for this rank." }
      }
    }
  },
  "/materials/stages/{id}": {
    get: {
      tags: ["Educational Materials - Stages"],
      summary: "Get stage details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Stage ID"
        }
      ],
      responses: {
        200: {
          description: "Stage retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "STAGE_FETCHED_SUCCESSFULLY" },
                  data: { type: "object" }
                }
              }
            }
          }
        },
        404: { description: "Stage not found." }
      }
    },
    patch: {
      tags: ["Educational Materials - Stages"],
      summary: "Update educational stage",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Stage ID"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name_ar: {
                  type: "string",
                  example: "المرحلة الأولى المحدثة",
                  description: "Arabic stage name"
                },
                name_en: {
                  type: "string",
                  example: "Stage One Updated",
                  description: "English stage name"
                },
                rankId: {
                  type: "string",
                  format: "uuid",
                  example: "45f94b32-9c16-43b3-8d07-c5ef547781b1",
                  description: "Target Rank ID"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Stage updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "STAGE_UPDATED_SUCCESSFULLY" },
                  data: { type: "object" }
                }
              }
            }
          }
        },
        400: { description: "Validation error." },
        404: { description: "Stage or rank not found." }
      }
    },
    delete: {
      tags: ["Educational Materials - Stages"],
      summary: "Delete educational stage",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Stage ID"
        }
      ],
      responses: {
        200: {
          description: "Stage deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "STAGE_DELETED_SUCCESSFULLY" }
                }
              }
            }
          }
        },
        404: { description: "Stage not found." },
        409: { description: "Cannot delete stage: linked to students, courses, or offline groups." }
      }
    }
  }
};
