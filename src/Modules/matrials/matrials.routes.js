import { Router } from "express";
import rankRouter from "./ranks/ranks.routes.js";
import coursesRouter from "./courses/courses.routes.js";
import lecturesRouter from "./lectures/lectures.routes.js";
import categoriesRouter from "./categories/categories.routes.js";

const router = Router();

router.use("/ranks", rankRouter);
router.use("/courses", coursesRouter);
router.use("/lectures", lecturesRouter);
router.use("/categories", categoriesRouter);

export default router;