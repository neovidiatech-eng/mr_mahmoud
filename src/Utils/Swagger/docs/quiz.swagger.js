export const quizPaths = {
  "/quiz": {
    get: {
      tags: ["Quizzes"],
      summary: "Get all quizzes",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "courseId", in: "query", schema: { type: "string", format: "uuid" } }
      ],
      responses: { 
        200: { description: "Quizzes list retrieved successfully." },
        400: { description: "Invalid parameters." },
        401: { description: "Unauthorized." }
      }
    },
    post: {
      tags: ["Quizzes"],
      summary: "Create a new quiz",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title_ar", "total_points", "pass_points", "duration_min", "questions"],
              properties: {
                title_ar: { type: "string", example: "اختبار تجريبي في الرياضيات" },
                title_en: { type: "string", example: "Sample Mathematics Quiz" },
                description_ar: { type: "string", example: "اختبار لتقييم المفاهيم الأساسية" },
                description_en: { type: "string", example: "Quiz to assess basic concepts" },
                total_points: { type: "integer", example: 100 },
                pass_points: { type: "integer", example: 60 },
                duration_min: { type: "integer", example: 30 },
                courseId: { type: "string", format: "uuid", example: "859bf2dd-38f1-4d3e-9608-ca7ca4699ce2", description: "Optional course UUID to attach the quiz to" },
                order: { type: "integer", example: 1, description: "Quiz display order within the course" },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["question_ar", "points", "order"],
                    properties: {
                      question_ar: { type: "string", example: "ما هو حاصل ضرب 12 في 12؟" },
                      question_en: { type: "string", example: "What is 12 multiplied by 12?" },
                      type: { type: "string", enum: ["MCQ", "TRUE_FALSE"], default: "MCQ" },
                      points: { type: "integer", example: 50 },
                      order: { type: "integer", example: 1 },
                      options: {
                        type: "array",
                        items: {
                          type: "object",
                          required: ["option_text_ar"],
                          properties: {
                            option_text_ar: { type: "string", example: "144" },
                            option_text_en: { type: "string", example: "144" },
                            is_correct: { type: "boolean", example: true }
                          }
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
      responses: { 
        201: { description: "Quiz created successfully." },
        400: { description: "Validation error." },
        401: { description: "Unauthorized." }
      }
    }
  },
  "/quiz/submit": {
    post: {
      tags: ["Quizzes"],
      summary: "Submit quiz answers",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["quiz_id", "answers"],
              properties: {
                quiz_id: { type: "string", format: "uuid", example: "859bf2dd-38f1-4d3e-9608-ca7ca4699ce2" },
                answers: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["question_id"],
                    properties: {
                      question_id: { type: "string", format: "uuid", example: "c3293b51-4a66-4565-9ea6-e253a955108f" },
                      option_id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: { 
        201: { description: "Quiz submitted successfully." },
        400: { description: "Invalid submission data." },
        404: { description: "Quiz not found." }
      }
    }
  },
  "/quiz/history": {
    get: {
      tags: ["Quizzes"],
      summary: "Get student quiz attempt history",
      description: "Returns paginated quiz attempts for the authenticated student. Requires a linked student profile. Filter by quiz using UUID or slug.",
      security: [{ bearerAuth: [] }],
      parameters: [ { name: "page", in: "query", required: false, schema: { type: "integer", minimum: 1, default: 1 } }, { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, default: 10 } }, { name: "student_id", in: "query", required: false, description: "Filter quiz attempts by student UUID.", schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" } }, { name: "quiz_id", in: "query", required: false, description: "Filter quiz attempts by quiz UUID.", schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440001" } } ],
      responses: { 
        200: { description: "Quiz attempt history retrieved successfully." },
        404: { description: "STUDENT_NOT_FOUND — user has no linked student profile | QUIZ_NOT_FOUND — no quiz matches the provided quiz_id or slug" },
        401: { description: "Unauthorized." }
      }
    }
  },
  "/quiz/history/{id}": {
    get: {
      tags: ["Quizzes"],
      summary: "Get quiz attempt details by attempt ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      responses: { 
        200: { description: "Quiz attempt details retrieved successfully." },
        404: { description: "Attempt not found." }
      }
    }
  },
  "/quiz/{id}": {
    get: {
      tags: ["Quizzes"],
      summary: "Get quiz details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      responses: { 
        200: { description: "Quiz details retrieved successfully." },
        404: { description: "Quiz not found." }
      }
    },
    patch: {
      tags: ["Quizzes"],
      summary: "Update quiz details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title_ar: { type: "string", example: "اختبار ميعاد معدل" },
                title_en: { type: "string", example: "Updated Math Quiz" },
                description_ar: { type: "string", example: "وصف معدل" },
                description_en: { type: "string", example: "Updated description" },
                total_points: { type: "integer", example: 100 },
                pass_points: { type: "integer", example: 70 },
                duration_min: { type: "integer", example: 45 },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      question_ar: { type: "string" },
                      question_en: { type: "string" },
                      type: { type: "string", enum: ["MCQ", "TRUE_FALSE"] },
                      points: { type: "integer" },
                      order: { type: "integer" },
                      options: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", format: "uuid" },
                            option_text_ar: { type: "string" },
                            option_text_en: { type: "string" },
                            is_correct: { type: "boolean" }
                          }
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
      responses: { 
        200: { description: "Quiz updated successfully." },
        400: { description: "Validation error." },
        404: { description: "Quiz not found." }
      }
    },
    delete: {
      tags: ["Quizzes"],
      summary: "Delete quiz by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      responses: { 
        200: { description: "Quiz deleted successfully." },
        404: { description: "Quiz not found." }
      }
    }
  }
};
