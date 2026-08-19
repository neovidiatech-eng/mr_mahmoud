import { Router } from "express";
import * as categoriesController from "./categories.controller.js";
import { validation } from "../../../Middlewares/Validation.js";
import { authorizeResource } from "../../../Middlewares/AuthorizeResource.js";
import * as schema from "./categories.validation.js";

const router = Router();
const categoriesResource = "categories";

router.get(
  "/",
  validation(schema.getCategoriesSchema),
  categoriesController.getAllCategories,
);

router.get(
  "/:id",
  validation(schema.getCategorySchema),
  categoriesController.getCategory,
);

router.post(
  "/",
  authorizeResource(categoriesResource),
  validation(schema.createCategorySchema),
  categoriesController.createCategory,
);

router.patch(
  "/:id",
  authorizeResource(categoriesResource),
  validation(schema.updateCategorySchema),
  categoriesController.updateCategory,
);

router.delete(
  "/:id",
  authorizeResource(categoriesResource),
  validation(schema.deleteCategorySchema),
  categoriesController.deleteCategory,
);

export default router;
