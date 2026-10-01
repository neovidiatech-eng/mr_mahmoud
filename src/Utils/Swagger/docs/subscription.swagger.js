export const subscriptionPaths = {
  "/subscription": {
    get: {
      tags: ["Subscriptions"],
      summary: "Get all student subscriptions",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Subscriptions list retrieved." } }
    }
  },
  "/subscription/my-subscription": {
    get: {
      tags: ["Subscriptions"],
      summary: "Get logged-in student's active subscription",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Student subscription retrieved." } }
    }
  },
  "/subscription/{studentId}/renew": {
    post: {
      tags: ["Subscriptions"],
      summary: "Renew student subscription",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "studentId", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["planId", "rankId", "courseId"],
              properties: {
                planId: { type: "string" },
                rankId: { type: "string" },
                courseId: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Subscription renewed." } }
    }
  },
  "/subscription/plans": {
    get: {
      tags: ["Subscription Plans"],
      summary: "Get all subscription plans",
      responses: { 200: { description: "Subscription plans list retrieved." } }
    },
    post: {
      tags: ["Subscription Plans"],
      summary: "Create subscription plan",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "price", "duration", "currencyId", "type"],
              properties: {
                name: { type: "string", example: "Monthly Premium" },
                description: { type: "string" },
                price: { type: "number", example: 299.99 },
                duration: { type: "integer", example: 1, description: "Duration in months" },
                sessionsCount: { type: "integer", default: 0 },
                rescheduleCount: { type: "integer", default: 0 },
                active: { type: "boolean", default: false },
                features: { type: "array", items: { type: "string" } },
                currencyId: { type: "string" },
                type: { type: "string", enum: ["quarterly", "annually", "halfAnnually"], example: "quarterly" },
                isGroup: { type: "boolean", default: false },
                maxStudents: { type: "string", default: "1" },
                planType: { type: "string", enum: ["individual", "group"], default: "individual" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Plan created." } }
    }
  },
  "/subscription/plans/{id}": {
    patch: {
      tags: ["Subscription Plans"],
      summary: "Update subscription plan",
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
                description: { type: "string" },
                price: { type: "number" },
                duration: { type: "integer" },
                sessionsCount: { type: "integer" },
                rescheduleCount: { type: "integer" },
                active: { type: "boolean" },
                features: { type: "array", items: { type: "string" } },
                currencyId: { type: "string" },
                type: { type: "string", enum: ["quarterly", "annually", "halfAnnually"] },
                isGroup: { type: "boolean" },
                maxStudents: { type: "string" },
                planType: { type: "string", enum: ["individual", "group"] }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Plan updated." } }
    },
    delete: {
      tags: ["Subscription Plans"],
      summary: "Delete subscription plan",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Plan deleted." } }
    }
  },
  "/subscription/requests": {
    get: {
      tags: ["Subscription Requests"],
      summary: "Get subscription requests",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: { type: "string", enum: ["pending", "rejected", "approved"] } }
      ],
      responses: {
        200: {
          description: "Subscription requests retrieved.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "FETCH_SUCCESS" },
                  data: {
                    type: "object",
                    properties: {
                      subscriptionRequests: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            planId: { type: "string" },
                            status: { type: "string", enum: ["pending", "approved", "rejected"] },
                            subscrption_img: { type: "string", nullable: true, description: "Uploaded payment receipt image path" },
                            createdAt: { type: "string", format: "date-time" },
                            user_id: { type: "string" },
                            user: { type: "object" },
                            plan: { type: "object" }
                          }
                        }
                      },
                      pagination: { type: "object" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/subscription/requests/change-status/{id}": {
    put: {
      tags: ["Subscription Requests"],
      summary: "Change status of subscription request",
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
              required: ["status"],
              properties: {
                status: { type: "string", enum: ["approved", "rejected"] },
                rankId: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Status changed successfully." } }
    }
  }
};
