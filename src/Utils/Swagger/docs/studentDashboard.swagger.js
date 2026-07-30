export const studentDashboardPaths = {
  "/student/profile": {
    get: {
      tags: ["Student Dashboard"],
      summary: "Get logged-in student profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Student profile retrieved successfully." },
        401: { description: "Unauthorized" }
      }
    },
    patch: {
      tags: ["Student Dashboard"],
      summary: "Update student profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fullName: { type: "string" },
                phone: { type: "string" },
                parentPhone: { type: "string" },
                grade: { type: "string" },
                timezone: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Profile updated successfully." }
      }
    }
  },
  "/student/dashboard": {
    get: {
      tags: ["Student Dashboard"],
      summary: "Get student dashboard summary & analytics",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Student dashboard stats retrieved successfully." }
      }
    }
  }
};
