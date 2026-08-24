export const quizPaths = {
  "/quiz": {
    get: {
      tags: ["Quizzes"],
      summary: "Get all quizzes",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Quizzes list retrieved successfully." } }
    }
  }
};
