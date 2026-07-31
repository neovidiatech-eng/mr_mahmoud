import { Router } from "express";
import authentication from "../../Middlewares/Authentication.js";
import { authorize } from "../../Middlewares/Authorize.js";
import { validation } from "../../Middlewares/Validation.js";
import * as controller from "./posts.controller.js";
import * as schema from "./posts.validation.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";

const router = Router();

// ─── Public routes (website: blog/news listing + article page) ─────────────
router.get("/", validation(schema.getPostsSchema), controller.getPosts);
router.get("/slug/:slug", validation(schema.postSlugSchema), controller.getPostBySlug);

// ─── Admin-only management routes ───────────────────────────────────────────
router.get(
  "/:id",
  authentication,
  authorize(PERMISSIONS_V2.BLOG.MANAGE),
  validation(schema.postIdSchema),
  controller.getPostById,
);

router.post(
  "/",
  authentication,
  authorize(PERMISSIONS_V2.BLOG.MANAGE),
  validation(schema.createPostSchema),
  controller.createPost,
);

router.patch(
  "/:id",
  authentication,
  authorize(PERMISSIONS_V2.BLOG.MANAGE),
  validation(schema.updatePostSchema),
  controller.updatePost,
);

router.delete(
  "/:id",
  authentication,
  authorize(PERMISSIONS_V2.BLOG.MANAGE),
  validation(schema.postIdSchema),
  controller.deletePost,
);

export default router;
