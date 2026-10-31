import { asyncHandler } from "../Utils/Response.js";
import { verifyToken } from "../Utils/Token/token.js";
import * as db from "../database/dbService.js";
import { redis } from "../Utils/Radis/Connection.js";
import { hasPermission, getUserPermissions } from "../Utils/Permissions/permissions.js";
import { applyUserTimezone } from "./Timezone.js";



export const guestAuth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }
  const [bearer, token] = authorization.split(" ");
  if (!token || !bearer || bearer !== "Bearer") {
    return next();
  }

  let decoded;
  try {
    decoded = verifyToken({ token });
  } catch (tokenErr) {
    // If token is invalid or expired, continue as guest
    return next();
  }

  if (!decoded || !decoded.id) {
    return next();
  }

  const cacheKey = `user:${decoded.id}`;
  let user;

  // Try to get user from cache
  try {
    const cachedUser = await redis.get(cacheKey);
    if (cachedUser) {
      user = JSON.parse(cachedUser);
    }
  } catch (cacheError) {
    // Continue to DB if cache fails — cache errors are non-fatal
  }

  if (!user) {
    user = await db.findFirst({
      model: "user",
      where: {
        id: decoded.id,
        confirmAt: { not: null },
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
        student: true,
        teacher: true,
      },
    });

    if (user) {
      // Cache for 5 minutes (300 seconds)
      try {
        await redis.set(cacheKey, JSON.stringify(user), { EX: 300 });
      } catch {
        // Cache set failure is non-fatal; continue without caching
      }
    }
  }

  if (!user) {
    return next();
  }

  // Attach helper method to check permissions and cache permissions list
  req.permissions = getUserPermissions(user);
  user.hasPermission = (permissionCode) => req.permissions.has(permissionCode);

  req.user = user;

  // Upgrade req.timezone to the user's stored timezone (overrides GeoIP / header)
  applyUserTimezone(req);

  next();
});
