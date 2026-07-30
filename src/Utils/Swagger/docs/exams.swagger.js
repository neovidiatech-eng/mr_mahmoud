export const examsPaths = {
  "/exams": {
    get: {
      tags: ["Exams"],
      summary: "Get all exams",
      security: [{ bearerAuth: [] }],
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
              required: ["title", "durationMinutes"],
              properties: {
                title: { type: "string", example: "Midterm Physics Exam" },
                durationMinutes: { type: "integer", example: 60 },
                totalMarks: { type: "number", example: 100 },
                passingMarks: { type: "number", example: 50 }
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
              required: ["text", "type", "options"],
              properties: {
                text: { type: "string", example: "What is the speed of light?" },
                type: { type: "string", enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "ESSAY"] },
                options: { type: "array", items: { type: "string" } },
                correctAnswer: { type: "string" },
                marks: { type: "number", example: 5 }
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
              properties: {
                answers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      questionId: { type: "string" },
                      answer: { type: "string" }
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
