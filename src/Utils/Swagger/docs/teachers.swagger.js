export const teachersPaths = {
  "/teachers": {
    get: {
      tags: ["Teachers Management"],
      summary: "Get all teachers",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, default: 10 } },
        { name: "sort", in: "query", schema: { type: "string" } },
        { name: "sortType", in: "query", schema: { type: "string", enum: ["asc", "desc"] } }
      ],
      responses: { 200: { description: "Teachers list retrieved." } }
    }
  },
  "/teachers/my-students": {
    get: {
      tags: ["Teachers Management"],
      summary: "Get assigned students for logged-in teacher",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Teacher's students retrieved." } }
    }
  },
  "/teachers/create": {
    post: {
      tags: ["Teachers Management"],
      summary: "Create teacher account",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "phone", "code_country", "currency_id", "gender", "age", "hour_price", "active"],
              properties: {
                name: { type: "string", example: "Mahmoud Hassan" },
                email: { type: "string", format: "email", example: "teacher@example.com" },
                password: { type: "string", format: "password", example: "Password123!" },
                phone: { type: "string", example: "1000000002" },
                code_country: { type: "string", example: "+20" },
                currency_id: { type: "string", example: "EGP" },
                gender: { type: "string", enum: ["MALE", "FEMALE"], example: "MALE" },
                age: { type: "number", example: 35 },
                hour_price: { type: "number", example: 150 },
                group_hour_price: { type: "number", example: 50 },
                active: { type: "boolean", default: true }
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
    }
  },
  "/teachers/update/{id}": {
    patch: {
      tags: ["Teachers Management"],
      summary: "Update teacher profile",
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
                email: { type: "string", format: "email" },
                password: { type: "string" },
                phone: { type: "string" },
                code_country: { type: "string" },
                currency_id: { type: "string" },
                gender: { type: "string", enum: ["MALE", "FEMALE"] },
                age: { type: "number" },
                hour_price: { type: "number" },
                group_hour_price: { type: "number" },
                active: { type: "boolean" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Teacher updated." } }
    }
  },
  "/teachers/delete/{id}": {
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
      parameters: [
        { name: "search", in: "query", schema: { type: "string" } }
      ],
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
              required: ["name_ar"],
              properties: {
                name_ar: { type: "string", example: "الفيزياء" },
                name_en: { type: "string", example: "Physics" },
                color: { type: "string", example: "#3357FF" },
                active: { type: "boolean", default: true }
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
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name_ar: { type: "string" },
                name_en: { type: "string" },
                color: { type: "string" },
                active: { type: "boolean" }
              }
            }
          }
        }
      },
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
