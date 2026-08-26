export const offlineGroupsPaths = {
  "/offline-groups": {
    get: {
      tags: ["Offline Groups"],
      summary: "Get all offline groups with pagination",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: {
        200: {
          description: "Offline groups list retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "OFFLINE_GROUPS_FETCHED_SUCCESSFULLY" },
                  data: {
                    type: "object",
                    properties: {
                      groups: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", format: "uuid" },
                            qrToken: { type: "string" },
                            qrActive: { type: "boolean" },
                            stageId: { type: "string", format: "uuid" },
                            createdAt: { type: "string", format: "date-time" },
                            stage: { type: "object" },
                            courses: { type: "array", items: { type: "object" } }
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
      tags: ["Offline Groups"],
      summary: "Create offline group for a stage",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["stageId", "courseIds"],
              properties: {
                stageId: {
                  type: "string",
                  format: "uuid",
                  example: "45f94b32-9c16-43b3-8d07-c5ef547781b1",
                  description: "Educational Stage ID"
                },
                courseIds: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uuid",
                    example: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
                  },
                  minItems: 1,
                  description: "Array of course IDs linked to this offline group"
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Offline group created successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "OFFLINE_GROUP_CREATED" },
                  data: { type: "object" }
                }
              }
            }
          }
        },
        400: { description: "Validation error or empty course IDs." },
        404: { description: "Stage or course not found." },
        409: { description: "Offline group already exists for this stage." }
      }
    }
  },
  "/offline-groups/scan": {
    get: {
      tags: ["Offline Groups"],
      summary: "Scan offline group QR code token",
      description: "Public endpoint to validate offline group QR token and retrieve scannable course list.",
      parameters: [
        {
          name: "token",
          in: "query",
          required: true,
          schema: { type: "string" },
          example: "9f8e7d6c5b4a3210fedcba9876543210",
          description: "QR token string"
        }
      ],
      responses: {
        200: {
          description: "Offline group scannable courses retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "OFFLINE_GROUP_FETCHED_SUCCESSFULLY" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        course: {
                          type: "object",
                          properties: {
                            id: { type: "string", format: "uuid" },
                            name_en: { type: "string" },
                            name_ar: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: { description: "QR token is required." },
        404: { description: "Offline group not found or QR code inactive." }
      }
    }
  },
  "/offline-groups/{id}": {
    get: {
      tags: ["Offline Groups"],
      summary: "Get offline group details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Offline Group ID"
        }
      ],
      responses: {
        200: {
          description: "Offline group retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "OFFLINE_GROUP_FETCHED_SUCCESSFULLY" },
                  data: { type: "object" }
                }
              }
            }
          }
        },
        404: { description: "Offline group not found." }
      }
    },
    put: {
      tags: ["Offline Groups"],
      summary: "Update offline group courses or QR active status",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Offline Group ID"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                courseIds: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uuid"
                  },
                  minItems: 1,
                  description: "Updated list of course IDs"
                },
                qrActive: {
                  type: "boolean",
                  example: true,
                  description: "Enable or disable QR code scanning"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Offline group updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "OFFLINE_GROUP_UPDATED_SUCCESSFULLY" },
                  data: { type: "object" }
                }
              }
            }
          }
        },
        400: { description: "Validation error." },
        404: { description: "Offline group or course not found." }
      }
    },
    delete: {
      tags: ["Offline Groups"],
      summary: "Delete offline group",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Offline Group ID"
        }
      ],
      responses: {
        200: {
          description: "Offline group deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "OFFLINE_GROUP_DELETED_SUCCESSFULLY" }
                }
              }
            }
          }
        },
        404: { description: "Offline group not found." }
      }
    }
  }
};
