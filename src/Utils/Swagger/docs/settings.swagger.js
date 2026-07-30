export const settingsPaths = {
  "/settings": {
    get: {
      tags: ["Settings"],
      summary: "Get platform system settings",
      responses: { 200: { description: "Settings retrieved." } }
    },
    patch: {
      tags: ["Settings"],
      summary: "Update system settings (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                siteName: { type: "string" },
                contactEmail: { type: "string" },
                supportPhone: { type: "string" },
                maintenanceMode: { type: "boolean" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Settings updated." } }
    }
  }
};
