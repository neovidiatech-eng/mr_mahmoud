export const calendarPaths = {
  "/calendar": {
    get: {
      tags: ["Calendar"],
      summary: "Get overall calendar events",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
        { name: "endDate", in: "query", schema: { type: "string", format: "date" } }
      ],
      responses: { 200: { description: "Calendar events retrieved." } }
    }
  },
  "/calendar/student": {
    get: {
      tags: ["Calendar"],
      summary: "Get student calendar events",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Student calendar retrieved." } }
    }
  },
  "/calendar/teacher": {
    get: {
      tags: ["Calendar"],
      summary: "Get teacher calendar events",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Teacher calendar retrieved." } }
    }
  },
  "/calendar/teachers": {
    get: {
      tags: ["Calendar"],
      summary: "Get all teachers calendar overview",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Teachers calendar overview retrieved." } }
    }
  }
};
