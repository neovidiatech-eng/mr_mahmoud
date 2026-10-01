export const homeworkPaths = {
  "/homework": {
    get: {
      tags: ["Homework"],
      summary: "Get all homework assignments",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "studentId", in: "query", schema: { type: "string" } },
        { name: "teacherId", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: { type: "string" } },
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } }
      ],
      responses: { 200: { description: "Homework assignments retrieved." } }
    },
    post: {
      tags: ["Homework"],
      summary: "Create homework assignment",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title_ar", "description_ar", "dueDate", "studentId"],
              properties: {
                title_ar: { type: "string", example: "واجب الرياضيات 1" },
                title_en: { type: "string", example: "Math Homework 1" },
                description_ar: { type: "string", example: "حل التمارين من الصفحة 10 إلى 15" },
                description_en: { type: "string", example: "Solve exercises from page 10 to 15" },
                dueDate: { type: "string", format: "date-time" },
                studentId: { type: "string" },
                subjectId: { type: "string" },
                teacherId: { type: "string" },
                status: { type: "string", enum: ["pending", "submitted", "completed", "graded"], default: "pending" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Homework created." } }
    }
  },
  "/homework/student-homework": {
    get: {
      tags: ["Homework"],
      summary: "Get homework assigned to logged-in student",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Student homework assignments retrieved." } }
    }
  },
  "/homework/student/{id}": {
    get: {
      tags: ["Homework"],
      summary: "Get homework details by ID for student",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Homework details retrieved." } }
    }
  },
  "/homework/{id}": {
    patch: {
      tags: ["Homework"],
      summary: "Update homework assignment",
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
                description_ar: { type: "string" },
                description_en: { type: "string" },
                dueDate: { type: "string", format: "date-time" },
                studentId: { type: "string" },
                subjectId: { type: "string" },
                grade: { type: "number" },
                feedback: { type: "string" },
                status: { type: "string", enum: ["pending", "submitted", "completed", "graded"] }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Homework updated." } }
    },
    delete: {
      tags: ["Homework"],
      summary: "Delete homework assignment",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Homework deleted." } }
    }
  },
  "/homework/{id}/submit": {
    post: {
      tags: ["Homework"],
      summary: "Submit homework solution (with optional attachment)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                attachments: { type: "string", format: "binary" },
                notes: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Homework submitted successfully." } }
    }
  }
};
