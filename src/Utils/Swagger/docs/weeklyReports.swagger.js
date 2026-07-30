export const weeklyReportsPaths = {
  "/weekly-reports": {
    get: {
      tags: ["Weekly Reports"],
      summary: "Get all weekly reports",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Weekly reports retrieved." } }
    },
    post: {
      tags: ["Weekly Reports"],
      summary: "Create weekly report for student",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["studentId", "summary"],
              properties: {
                studentId: { type: "string" },
                summary: { type: "string" },
                performanceGrade: { type: "string" },
                teacherNotes: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Weekly report created." } }
    }
  },
  "/weekly-reports/my-reports": {
    get: {
      tags: ["Weekly Reports"],
      summary: "Get logged-in user weekly reports",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "User weekly reports retrieved." } }
    }
  },
  "/weekly-reports/metrics": {
    get: {
      tags: ["Weekly Reports"],
      summary: "Get weekly report metrics",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Report metrics retrieved." } }
    }
  },
  "/weekly-reports/{id}": {
    get: {
      tags: ["Weekly Reports"],
      summary: "Get weekly report by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Weekly report details retrieved." } }
    },
    patch: {
      tags: ["Weekly Reports"],
      summary: "Update weekly report",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Weekly report updated." } }
    },
    delete: {
      tags: ["Weekly Reports"],
      summary: "Delete weekly report",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Weekly report deleted." } }
    }
  }
};
