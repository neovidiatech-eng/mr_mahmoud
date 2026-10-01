export const settingsPaths = {
  "/settings": {
    get: {
      tags: ["Settings"],
      summary: "Get platform system settings (Public)",
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
                userPrefix: { type: "string", example: "mr_mahmoud" },
                socialLinks: {
                  type: "object",
                  example: {
                    facebook: "https://facebook.com/mrmahmoud",
                    youtube: "https://youtube.com/@mrmahmoud",
                    whatsapp: "+201000000000"
                  }
                },
                contactInfo: {
                  type: "object",
                  example: {
                    email: "info@example.com",
                    phone: "+201000000000",
                    address: "Cairo, Egypt"
                  }
                },
                paymentMethods: {
                  type: "object",
                  example: {
                    vodafoneCash: "01000000000",
                    instaPay: "01000000000",
                    fawry: "12345"
                  }
                }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Settings updated." } }
    }
  }
};

