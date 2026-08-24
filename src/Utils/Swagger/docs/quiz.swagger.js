export const quizPaths = {
  "/quiz": {
    get: {
      tags: ["Quizzes"],
      summary: "Get all quizzes",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: { 200: { description: "Quizzes list retrieved successfully." } }
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
              required: ["title_ar", "description_ar", "total_points", "pass_points", "duration_min", "questions"],
              properties: {
                title_ar: { type: "string", example: "اختبار تجريبي في الرياضيات" },
                title_en: { type: "string", example: "Sample Mathematics Quiz" },
                description_ar: { type: "string", example: "اختبار لتقييم المفاهيم الأساسية" },
                description_en: { type: "string", example: "Quiz to assess basic concepts" },
                total_points: { type: "integer", example: 100 },
                pass_points: { type: "integer", example: 60 },
                duration_min: { type: "integer", example: 30 },
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
      responses: { 201: { description: "Quiz created successfully." } }
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
      responses: { 201: { description: "Quiz submitted successfully." } }
    }
  },
  "/quiz/history": {
    get: {
      tags: ["Quizzes"],
      summary: "Get student quiz attempt history",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "quiz_id", in: "query", schema: { type: "string", format: "uuid" } }
      ],
      responses: { 200: { description: "Quiz attempt history retrieved successfully." } }
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
      responses: { 200: { description: "Quiz attempt details retrieved successfully." } }
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
      responses: { 200: { description: "Quiz details retrieved successfully." } }
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
                duration_min: { type: "integer", example: 45 }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Quiz updated successfully." } }
    },
    delete: {
      tags: ["Quizzes"],
      summary: "Delete quiz by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
      ],
      responses: { 200: { description: "Quiz deleted successfully." } }
    }
  }
};
