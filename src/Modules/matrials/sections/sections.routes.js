import { Router } from "express";
import * as sectionsController from "./sections.controller.js";
import { validation } from "../../../Middlewares/Validation.js";
import authentication from "../../../Middlewares/Authentication.js";
import { authorizeResource } from "../../../Middlewares/AuthorizeResource.js";
import * as sectionsValidation from "./sections.validation.js";

const router = Router();
const sectionsResource = "sections";

router.get("/", sectionsController.getAllSections);

router.get(
  "/:id",
  validation(sectionsValidation.sectionIdSchema),
  sectionsController.getSection,
);

router.post(
  "/",
  authentication,
  authorizeResource(sectionsResource),
  validation(sectionsValidation.createSectionSchema),
  sectionsController.createSection,
);

router.patch(
  "/:id",
  authentication,
  authorizeResource(sectionsResource),
  validation(sectionsValidation.updateSectionSchema),
  sectionsController.updateSection,
);

router.delete(
  "/:id",
  authentication,
  authorizeResource(sectionsResource),
  validation(sectionsValidation.sectionIdSchema),
  sectionsController.deleteSection,
);

router.post(
  "/:id/items",
  authentication,
  authorizeResource(sectionsResource),
  validation(sectionsValidation.addSectionItemsSchema),
  sectionsController.addSectionItems,
);

router.delete(
  "/:id/items/:itemId",
  authentication,
  authorizeResource(sectionsResource),
  validation(sectionsValidation.removeSectionItemSchema),
  sectionsController.removeSectionItem,
);

export default router;
