export const studentsPaths = {
  "/students": {
    get: {
      tags: ["Students Management"],
      summary: "Get all registered students",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, default: 10 } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "active", in: "query", schema: { type: "boolean" } }
      ],
      responses: { 200: { description: "Students list retrieved." } }
    }
  },
  "/students/create": {
    post: {
      tags: ["Students Management"],
      summary: "Create new student account (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "phone", "phone_code", "country", "planId", "gender", "active", "type"],
              properties: {
                name: { type: "string", example: "Karem Mahmoud" },
                email: { type: "string", format: "email", example: "karem@example.com" },
                password: { type: "string", format: "password", example: "Password123!" },
                phone: { type: "string", example: "1000000001" },
                phone_code: { type: "string", example: "+20" },
                country: { type: "string", example: "Egypt" },
                planId: { type: "string" },
                age: { type: "integer", example: 16 },
                birth_date: { type: "string", format: "date", example: "2008-01-01" },
                gender: { type: "string", enum: ["MALE", "FEMALE"] },
                active: { type: "boolean", default: true },
                rankId: { type: "string" },
                startingCourseId: { type: "string" },
                startingLectureId: { type: "string" },
                type: { type: "string", enum: ["online", "onsite"], default: "online", example: "online" },
                timezone: { type: "string", example: "Africa/Cairo" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Student account created." } }
    }
  },
  "/students/{id}": {
    get: {
      tags: ["Students Management"],
      summary: "Get student details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Student details retrieved." } }
    },
    delete: {
      tags: ["Students Management"],
      summary: "Delete student account",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Student deleted." } }
    }
  },
  "/students/update/{id}": {
    patch: {
      tags: ["Students Management"],
      summary: "Update student details",
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
                name: { type: "string" },
                username: { type: "string" },
                password: { type: "string" },
                phone: { type: "string" },
                phone_code: { type: "string" },
                country: { type: "string" },
                planId: { type: "string" },
                birth_date: { type: "string", format: "date" },
                age: { type: "integer" },
                gender: { type: "string", enum: ["MALE", "FEMALE"] },
                active: { type: "boolean" },
                rankId: { type: "string" },
                type: { type: "string", enum: ["online", "onsite"] },
                timezone: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Student updated." } }
    }
  }
};
