export const examsPaths = {
  "/exams": {
    get: {
      tags: ["Exams"],
      summary: "Get all exams",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "studentId", in: "query", schema: { type: "string" } },
        { name: "teacherId", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: { type: "string" } }
      ],
      responses: { 200: { description: "Exams retrieved." } }
    },
    post: {
      tags: ["Exams"],
      summary: "Create exam",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["studentId", "duration"],
              properties: {
                title_ar: { type: "string", example: "امتحان منتصف الفصل في الفيزياء" },
                title_en: { type: "string", example: "Midterm Physics Exam" },
                subject: { type: "string", example: "Physics" },
                dueDate: { type: "string", format: "date-time" },
                studentId: { type: "string" },
                teacherId: { type: "string" },
                status: { type: "string", enum: ["pending", "in_progress", "submitted", "graded"], default: "pending" },
                totalMarks: { type: "number", example: 100 },
                duration: { type: "number", example: 60, description: "Exam duration in minutes" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Exam created." } }
    }
  },
  "/exams/user-exams": {
    get: {
      tags: ["Exams"],
      summary: "Get logged-in user exams",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "User exams retrieved." } }
    }
  },
  "/exams/exam/{id}": {
    get: {
      tags: ["Exams"],
      summary: "Get exam details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Exam details retrieved." } }
    }
  },
  "/exams/{id}": {
    patch: {
      tags: ["Exams"],
      summary: "Update exam",
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
                title_ar: { type: "string" },
                title_en: { type: "string" },
                subject: { type: "string" },
                dueDate: { type: "string", format: "date-time" },
                studentId: { type: "string" },
                teacherId: { type: "string" },
                totalMarks: { type: "number" },
                duration: { type: "number" },
                status: { type: "string", enum: ["pending", "in_progress", "submitted", "graded"] }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Exam updated." } }
    },
    delete: {
      tags: ["Exams"],
      summary: "Delete exam",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Exam deleted." } }
    }
  },
  "/exams/{id}/questions": {
    get: {
      tags: ["Exams Question Bank"],
      summary: "Get questions for exam",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Exam questions retrieved." } }
    },
    post: {
      tags: ["Exams Question Bank"],
      summary: "Add question to exam",
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
              required: ["text_ar", "options"],
              properties: {
                text_ar: { type: "string", example: "ما هي السرعة المدارية؟" },
                text_en: { type: "string", example: "What is orbital velocity?" },
                type: { type: "string", enum: ["mcq", "true_false"], default: "mcq" },
                points: { type: "number", default: 1 },
                order: { type: "integer", default: 0 },
                options: {
                  type: "array",
                  minItems: 2,
                  items: {
                    type: "object",
                    required: ["text_ar"],
                    properties: {
                      text_ar: { type: "string", example: "السرعة اللازمة للبقاء في المدار" },
                      text_en: { type: "string", example: "Speed required to stay in orbit" },
                      isCorrect: { type: "boolean", default: false }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Question added." } }
    }
  },
  "/exams/questions/{questionId}": {
    patch: {
      tags: ["Exams Question Bank"],
      summary: "Update exam question",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "questionId", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                text_ar: { type: "string" },
                text_en: { type: "string" },
                type: { type: "string", enum: ["mcq", "true_false"] },
                points: { type: "number" },
                order: { type: "integer" },
                options: {
                  type: "array",
                  minItems: 2,
                  items: {
                    type: "object",
                    properties: {
                      text_ar: { type: "string" },
                      text_en: { type: "string" },
                      isCorrect: { type: "boolean" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Question updated." } }
    },
    delete: {
      tags: ["Exams Question Bank"],
      summary: "Delete exam question",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "questionId", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Question deleted." } }
    }
  },
  "/exams/{id}/start": {
    post: {
      tags: ["Exams Attempt"],
      summary: "Start exam session",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Exam session started." } }
    }
  },
  "/exams/{id}/submit": {
    post: {
      tags: ["Exams Attempt"],
      summary: "Submit exam answers",
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
              required: ["answers"],
              properties: {
                answers: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["questionId"],
                    properties: {
                      questionId: { type: "string" },
                      selectedOptionId: { type: "string", nullable: true }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Exam submitted successfully." } }
    }
  }
};
