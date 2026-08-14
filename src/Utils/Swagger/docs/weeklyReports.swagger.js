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
      summary: "Create weekly report for teacher",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["weekStarting", "weekEnding", "totalClasses", "studentsTaught", "avgSessionDuration", "materialsUploaded"],
              properties: {
                weekStarting: { type: "string", format: "date-time" },
                weekEnding: { type: "string", format: "date-time" },
                totalClasses: { type: "integer", example: 10 },
                studentsTaught: { type: "integer", example: 25 },
                avgSessionDuration: { type: "number", example: 60 },
                materialsUploaded: { type: "integer", example: 3 },
                teachingSummary: { type: "string" },
                studentProgress: { type: "string" },
                challenges: { type: "string" },
                overallRating: { type: "number", minimum: 0, maximum: 5, example: 4.5 }
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
      parameters: [
        { name: "weekStarting", in: "query", required: true, schema: { type: "string", format: "date" } },
        { name: "weekEnding", in: "query", required: true, schema: { type: "string", format: "date" } }
      ],
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
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                weekStarting: { type: "string", format: "date-time" },
                weekEnding: { type: "string", format: "date-time" },
                totalClasses: { type: "integer" },
                studentsTaught: { type: "integer" },
                avgSessionDuration: { type: "number" },
                materialsUploaded: { type: "integer" },
                teachingSummary: { type: "string" },
                studentProgress: { type: "string" },
                challenges: { type: "string" },
                overallRating: { type: "number" }
              }
            }
          }
        }
      },
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
