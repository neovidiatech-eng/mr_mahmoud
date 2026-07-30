export const teacherDashboardPaths = {
  "/teacher/profile": {
    get: {
      tags: ["Teacher Dashboard"],
      summary: "Get logged-in teacher profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Teacher profile retrieved." }
      }
    }
  },
  "/teacher/profile/my-students": {
    get: {
      tags: ["Teacher Dashboard"],
      summary: "Get list of students assigned to teacher",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Teacher students retrieved successfully." }
      }
    }
  },
  "/teacher/transactions": {
    get: {
      tags: ["Teacher Dashboard"],
      summary: "Get teacher transaction history",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Transactions history retrieved." }
      }
    }
  }
};
