export const authPaths = {
  "/auth/sign-up": {
    post: {
      tags: ["Authentication"],
      summary: "Register a new student account",
      description: "Registers a student account with required plan and sends an OTP verification email.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "codeCountry", "phone", "gender", "country", "plan_id", "stageId"],
              properties: {
                name: { type: "string", example: "Ahmed Ali" },
                email: { type: "string", format: "email", example: "ahmed@example.com" },
                password: { type: "string", format: "password", example: "Password123!" },
                stageId: { type: "string", format: "uuid", example: "45f94b32-9c16-43b3-8d07-c5ef547781b1", description: "Educational Stage ID" },
                codeCountry: { type: "string", example: "+20" },
                phone: { type: "string", example: "1000000000" },
                parentNumber: { type: "string", example: "1000000002", description: "Parent phone number (optional)" },
                gender: { type: "string", enum: ["male", "female"], example: "male" },
                country: { type: "string", example: "Egypt" },
                plan_id: { type: "string", example: "60d5ec49f1b2c80015f8e4a1" },
                age: { type: "integer", example: 17 },
                birth_date: { type: "string", format: "date", example: "2007-05-15" },
                timezone: { type: "string", example: "Africa/Cairo" },
                image: { type: "string", format: "binary", description: "Subscription image / payment receipt proof (optional)" }
              }
            }
          },
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "codeCountry", "phone", "gender", "country", "plan_id", "stageId"],
              properties: {
                name: { type: "string", example: "Ahmed Ali" },
                email: { type: "string", format: "email", example: "ahmed@example.com" },
                password: { type: "string", format: "password", example: "Password123!" },
                stageId: { type: "string", format: "uuid", example: "45f94b32-9c16-43b3-8d07-c5ef547781b1", description: "Educational Stage ID" },
                codeCountry: { type: "string", example: "+20" },
                phone: { type: "string", example: "1000000000" },
                parentNumber: { type: "string", example: "1000000002", description: "Parent phone number (optional)" },
                gender: { type: "string", enum: ["male", "female"], example: "male" },
                country: { type: "string", example: "Egypt" },
                plan_id: { type: "string", example: "60d5ec49f1b2c80015f8e4a1" },
                age: { type: "integer", example: 17 },
                birth_date: { type: "string", format: "date", example: "2007-05-15" },
                timezone: { type: "string", example: "Africa/Cairo" }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "User registered successfully. OTP verification code sent." },
        400: { description: "Validation error or user already exists." }
      }
    }
  },
  "/auth/sign-in": {
    post: {
      tags: ["Authentication"],
      summary: "Sign in with email/phone and password",
      description: "Authenticates a user and returns a JWT Access Token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "ahmed@example.com", description: "Email address or phone number" },
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
              required: ["email", "otp"],
              properties: {
                email: { type: "string", format: "email", example: "ahmed@example.com" },
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
              required: ["email"],
              properties: {
                email: { type: "string", format: "email", example: "ahmed@example.com" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Verification OTP code sent to email." }
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
              required: ["email"],
              properties: {
                email: { type: "string", format: "email", example: "ahmed@example.com" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Password reset OTP code sent to email." }
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
              required: ["email", "otp", "password", "confirm"],
              properties: {
                email: { type: "string", format: "email", example: "ahmed@example.com" },
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
