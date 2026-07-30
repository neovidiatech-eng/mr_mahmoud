export const systemPaths = {
  "/system/timezones": {
    get: {
      tags: ["System Administration"],
      summary: "List all supported IANA timezones (Public)",
      responses: { 200: { description: "Timezones list retrieved." } }
    }
  },
  "/system/dashboard": {
    get: {
      tags: ["System Administration"],
      summary: "Get admin system dashboard metrics",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "System dashboard stats retrieved." } }
    }
  },
  "/system/roles": {
    get: {
      tags: ["System Roles & Permissions"],
      summary: "Get all system roles",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Roles list retrieved." } }
    }
  },
  "/system/roles/create": {
    post: {
      tags: ["System Roles & Permissions"],
      summary: "Create system role",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "ASSISTANT_TEACHER" },
                description: { type: "string" },
                permissions: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Role created." } }
    }
  },
  "/system/roles/assign/{user_id}": {
    post: {
      tags: ["System Roles & Permissions"],
      summary: "Assign role to user",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "user_id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["roleId"],
              properties: { roleId: { type: "string" } }
            }
          }
        }
      },
      responses: { 200: { description: "Role assigned to user." } }
    }
  },
  "/system/roles/{id}": {
    patch: {
      tags: ["System Roles & Permissions"],
      summary: "Update role",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Role updated." } }
    },
    delete: {
      tags: ["System Roles & Permissions"],
      summary: "Delete role",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Role deleted." } }
    }
  },
  "/system/permissions": {
    get: {
      tags: ["System Roles & Permissions"],
      summary: "Get all system permissions",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Permissions list retrieved." } }
    }
  },
  "/system/permissions/create": {
    post: {
      tags: ["System Roles & Permissions"],
      summary: "Create permission definition",
      security: [{ bearerAuth: [] }],
      responses: { 201: { description: "Permission created." } }
    }
  },
  "/system/permissions/update/{id}": {
    patch: {
      tags: ["System Roles & Permissions"],
      summary: "Update permission",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Permission updated." } }
    }
  },
  "/system/permissions/{id}": {
    delete: {
      tags: ["System Roles & Permissions"],
      summary: "Delete permission",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Permission deleted." } }
    }
  },
  "/system/permissions/add-permissions-to-role/{roleId}": {
    patch: {
      tags: ["System Roles & Permissions"],
      summary: "Add permissions to role",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "roleId", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Permissions added to role." } }
    }
  },
  "/system/stuff": {
    get: {
      tags: ["System Staff Management"],
      summary: "Get all staff members",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Staff members list retrieved." } }
    }
  },
  "/system/stuff/create": {
    post: {
      tags: ["System Staff Management"],
      summary: "Create staff member",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["fullName", "email", "password", "roleId"],
              properties: {
                fullName: { type: "string" },
                email: { type: "string", format: "email" },
                password: { type: "string" },
                roleId: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Staff member created." } }
    }
  },
  "/system/stuff/{id}": {
    get: {
      tags: ["System Staff Management"],
      summary: "Get staff member by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Staff member retrieved." } }
    }
  },
  "/system/stuff/update/{id}": {
    patch: {
      tags: ["System Staff Management"],
      summary: "Update staff member",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Staff member updated." } }
    }
  },
  "/system/stuff/delete/{id}": {
    delete: {
      tags: ["System Staff Management"],
      summary: "Delete staff member",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Staff member deleted." } }
    }
  }
};
