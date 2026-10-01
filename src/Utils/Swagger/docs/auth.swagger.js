export const authPaths = {
  "/auth/sign-up": {
    post: {
      tags: ["Authentication"],
      summary: "Register a new student account",
      description: "Registers a student account with required plan and sends an OTP verification SMS to phone.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["name", "password", "codeCountry", "phone", "parentNumber", "gender", "country", "plan_id", "stageId", "rankId"],
              properties: {
                name: { type: "string", example: "Ahmed Ali" },
                phone: { type: "string", example: "01000000000", description: "Raw unencrypted phone number" },
                codeCountry: { type: "string", example: "+20" },
                email: { type: "string", format: "email", example: "ahmed@example.com", description: "Email address (optional)" },
                password: { type: "string", format: "password", example: "Password123!" },
                stageId: { type: "string", format: "uuid", example: "45f94b32-9c16-43b3-8d07-c5ef547781b1", description: "Educational Stage ID" },
                rankId: { type: "string", format: "uuid", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6", description: "Educational Rank ID" },
                parentNumber: { type: "string", example: "01000000002", description: "Parent unencrypted phone number" },
                gender: { type: "string", enum: ["male", "female"], example: "male" },
                country: { type: "string", example: "Egypt" },
                plan_id: { type: "string", example: "60d5ec49f1b2c80015f8e4a1" },
                age: { type: "integer", example: 17, description: "Student age (required if birth_date is omitted)" },
                birth_date: { type: "string", format: "date", example: "2007-05-15", description: "Student birth date (required if age is omitted)" },
                timezone: { type: "string", example: "Africa/Cairo" },
                image: { type: "string", format: "binary", description: "Subscription image / payment receipt proof (optional)" }
              }
            }
          },
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "password", "codeCountry", "phone", "parentNumber", "gender", "country", "plan_id", "stageId", "rankId"],
              properties: {
                name: { type: "string", example: "Ahmed Ali" },
                phone: { type: "string", example: "01000000000", description: "Raw unencrypted phone number" },
                codeCountry: { type: "string", example: "+20" },
                email: { type: "string", format: "email", example: "ahmed@example.com", description: "Email address (optional)" },
                password: { type: "string", format: "password", example: "Password123!" },
                stageId: { type: "string", format: "uuid", example: "45f94b32-9c16-43b3-8d07-c5ef547781b1", description: "Educational Stage ID" },
                rankId: { type: "string", format: "uuid", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6", description: "Educational Rank ID" },
                parentNumber: { type: "string", example: "01000000002", description: "Parent unencrypted phone number" },
                gender: { type: "string", enum: ["male", "female"], example: "male" },
                country: { type: "string", example: "Egypt" },
                plan_id: { type: "string", example: "60d5ec49f1b2c80015f8e4a1" },
                age: { type: "integer", example: 17, description: "Student age (required if birth_date is omitted)" },
                birth_date: { type: "string", format: "date", example: "2007-05-15", description: "Student birth date (required if age is omitted)" },
                timezone: { type: "string", example: "Africa/Cairo" }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "User registered successfully, OTP sent via SMS." },
        400: { description: "Validation error, PHONE_EXISTS, or EMAIL_EXISTS." }
      }
    }
  },
  "/auth/sign-in": {
    post: {
      tags: ["Authentication"],
      summary: "Sign in with phone/username and password",
      description: "Authenticates a user and returns a JWT Access Token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "01000000000", description: "Phone number, username, or email" },
                password: { type: "string", format: "password", example: "Password123!" }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Successful login.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Login successful" },
                  token: { type: "string", example: "eyJhbGciOi..." },
                  user: { type: "object" }
                }
              }
            }
          }
        },
        401: { description: "Invalid credentials or account unverified." }
      }
    }
  },
  "/auth/refresh": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh access token",
      description: "Generates a new access token using the HTTP-only refresh cookie.",
      responses: {
        200: { description: "New access token generated successfully." },
        401: { description: "Invalid or expired refresh token." }
      }
    }
  },
  "/auth/verify-account": {
    post: {
      tags: ["Authentication"],
      summary: "Verify account using OTP code",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["phone", "otp"],
              properties: {
                phone: { type: "string", example: "01000000000" },
                codeCountry: { type: "string", example: "+20" },
                otp: { type: "string", example: "123456" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Account verified successfully." },
        400: { description: "Invalid or expired OTP code." }
      }
    }
  },
  "/auth/resend-otp": {
    post: {
      tags: ["Authentication"],
      summary: "Resend account verification OTP code",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["phone"],
              properties: {
                phone: { type: "string", example: "01000000000" },
                codeCountry: { type: "string", example: "+20" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Verification OTP code sent to phone via SMS." }
      }
    }
  },
  "/auth/forget-password": {
    post: {
      tags: ["Authentication"],
      summary: "Request password reset OTP code",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["phone"],
              properties: {
                phone: { type: "string", example: "01000000000" },
                codeCountry: { type: "string", example: "+20" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Password reset OTP code sent to phone via SMS." }
      }
    }
  },
  "/auth/reset-password": {
    patch: {
      tags: ["Authentication"],
      summary: "Reset password using OTP code",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["phone", "otp", "password", "confirm"],
              properties: {
                phone: { type: "string", example: "01000000000" },
                codeCountry: { type: "string", example: "+20" },
                otp: { type: "string", example: "123456" },
                password: { type: "string", format: "password", example: "NewPassword123!" },
                confirm: { type: "string", format: "password", example: "NewPassword123!" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Password reset successfully." }
      }
    }
  }
};
