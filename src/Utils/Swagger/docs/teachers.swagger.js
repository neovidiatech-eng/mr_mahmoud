export const teachersPaths = {
  "/teachers": {
    get: {
      tags: ["Teachers Management"],
      summary: "Get all teachers",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Teachers list retrieved." } }
    },
    post: {
      tags: ["Teachers Management"],
      summary: "Create teacher account",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["fullName", "email", "password", "phone", "subjectIds"],
              properties: {
                fullName: { type: "string" },
                email: { type: "string", format: "email" },
                password: { type: "string" },
                phone: { type: "string" },
                subjectIds: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Teacher created." } }
    }
  },
  "/teachers/{id}": {
    get: {
      tags: ["Teachers Management"],
      summary: "Get teacher details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Teacher details retrieved." } }
    },
    patch: {
      tags: ["Teachers Management"],
      summary: "Update teacher profile",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Teacher updated." } }
    },
    delete: {
      tags: ["Teachers Management"],
      summary: "Delete teacher account",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Teacher deleted." } }
    }
  },
  "/teachers/subjects": {
    get: {
      tags: ["Subjects Management"],
      summary: "Get all subjects",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Subjects list retrieved." } }
    },
    post: {
      tags: ["Subjects Management"],
      summary: "Create subject",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Physics" },
                description: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Subject created." } }
    }
  },
  "/teachers/subjects/{id}": {
    get: {
      tags: ["Subjects Management"],
      summary: "Get subject by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Subject details retrieved." } }
    },
    patch: {
      tags: ["Subjects Management"],
      summary: "Update subject",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Subject updated." } }
    },
    delete: {
      tags: ["Subjects Management"],
      summary: "Delete subject",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Subject deleted." } }
    }
  }
};
