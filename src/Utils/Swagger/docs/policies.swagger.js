export const policiesPaths = {
  "/policies": {
    get: {
      tags: ["Policies & Notices"],
      summary: "Get all platform policies",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Policies list retrieved." } }
    },
    post: {
      tags: ["Policies & Notices"],
      summary: "Create policy (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title_ar", "description_ar"],
              properties: {
                title_ar: { type: "string", example: "سياسة الخصوصية" },
                title_en: { type: "string", example: "Privacy Policy" },
                description_ar: { type: "string", example: "تفاصيل سياسة الخصوصية..." },
                description_en: { type: "string", example: "Privacy policy details..." },
                icon: { type: "string", example: "shield" },
                color: { type: "string", example: "#4CAF50" },
                lastUpdated: { type: "string", format: "date-time" },
                active: { type: "boolean", default: true }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Policy created." } }
    }
  },
  "/policies/notice": {
    get: {
      tags: ["Policies & Notices"],
      summary: "Get active platform notice",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Active notice retrieved." } }
    },
    post: {
      tags: ["Policies & Notices"],
      summary: "Create / Update platform notice (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title_ar", "content_ar"],
              properties: {
                title_ar: { type: "string", example: "تنويه هام" },
                title_en: { type: "string", example: "Important Notice" },
                content_ar: { type: "string", example: "سيتم إجراء صيانه سريعة للنظام..." },
                content_en: { type: "string", example: "Scheduled system maintenance..." },
                active: { type: "boolean", default: true }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Notice saved." } }
    }
  },
  "/policies/{id}": {
    patch: {
      tags: ["Policies & Notices"],
      summary: "Update policy",
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
                icon: { type: "string" },
                color: { type: "string" },
                lastUpdated: { type: "string", format: "date-time" },
                active: { type: "boolean" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Policy updated." } }
    },
    delete: {
      tags: ["Policies & Notices"],
      summary: "Delete policy",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Policy deleted." } }
    }
  }
};
