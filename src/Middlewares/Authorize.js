import { asyncHandler } from "../Utils/Response.js";
import { isAdmin } from "../Utils/Permissions/permissions.js";

/**
 * Enterprise-style Authorization Middleware.
 * Validates if the authenticated user has the required permission code.
 * 
 * @param {string} permissionCode - The permission code in 'resource:action' format.
 */
export const authorize = (permissionCode) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      const err = new Error("UNAUTHORIZED_NO_TOKEN");
      err.cause = 401;
      err.isMessageKey = true;
      return next(err);
    }

    // Super Admin / Admin bypass
    if (isAdmin(user)) {
      return next();
    }

    // Allow student role access for student-level actions (prevents 403 due to stale cache or missing DB seed)
    if (user?.role?.name === "student") {
      const studentAllowedPermissions = [
        "quiz:read",
        "quiz:submit",
        "courses:read",
        "lectures:read",
        "sections:read",
        "exams:read",
      ];
      if (studentAllowedPermissions.includes(permissionCode)) {
        return next();
      }
    }

    // Check if user has the specific permission
    if (!req.permissions.has(permissionCode)) {
      const err = new Error("FORBIDDEN_PERMISSION");
      err.cause = 403;
      err.isMessageKey = true;
      return next(err);
    }

    next();
  });
};
