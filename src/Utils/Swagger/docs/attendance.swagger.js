export const attendancePaths = {
  "/attendance/check-in": {
    post: {
      tags: ["Attendance"],
      summary: "Check-in student attendance (via QR Token or Student ID)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                qrToken: { type: "string", example: "8f7c9a2e4b1d6a9c8e7f..." },
                studentId: { type: "string", format: "uuid" },
                status: { type: "string", enum: ["present", "absent", "late"], default: "present" },
                attendanceDate: { type: "string", format: "date", example: "2026-08-14" }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Attendance checked in successfully." },
        404: { description: "Student not found or inactive QR code." },
        409: { description: "Student already checked in today." }
      }
    }
  },
  "/attendance/today": {
    get: {
      tags: ["Attendance"],
      summary: "Get today's attendance summary and statistics",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Today's summary retrieved successfully." }
      }
    }
  },
  "/attendance": {
    get: {
      tags: ["Attendance"],
      summary: "Get all attendance records with pagination & filters",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, default: 20 } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "date", in: "query", schema: { type: "string", format: "date" } },
        { name: "status", in: "query", schema: { type: "string", enum: ["present", "absent", "late"] } },
        { name: "studentId", in: "query", schema: { type: "string" } }
      ],
      responses: {
        200: { description: "Attendance records retrieved." }
      }
    }
  },
  "/attendance/student/{studentId}": {
    get: {
      tags: ["Attendance"],
      summary: "Get attendance history for a specific student",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "studentId", in: "path", required: true, schema: { type: "string" } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, default: 20 } },
        { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
        { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
        { name: "status", in: "query", schema: { type: "string", enum: ["present", "absent", "late"] } }
      ],
      responses: {
        200: { description: "Student attendance history retrieved." },
        404: { description: "Student not found." }
      }
    }
  },
  "/attendance/{id}": {
    patch: {
      tags: ["Attendance"],
      summary: "Update attendance record status",
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
                status: { type: "string", enum: ["present", "absent", "late"] }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Attendance record updated." },
        404: { description: "Attendance record not found." }
      }
    },
    delete: {
      tags: ["Attendance"],
      summary: "Delete attendance record",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        200: { description: "Attendance record deleted." },
        404: { description: "Attendance record not found." }
      }
    }
  }
};
