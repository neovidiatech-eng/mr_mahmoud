import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as sectionsService from "./sections.service.js";
import { localize } from "../../../Utils/Localize/index.js";

const localizeSection = (section, lang) => {
  if (!section) return section;
  let result = localize(section, ["name"], lang);
  if (result.course) {
    result = { ...result, course: localize(result.course, ["title"], lang) };
  }
  if (result.section_items) {
    result.section_items = result.section_items.map((item) => {
      if (item.details) {
        if (item.item_type === "LECTURE") {
          return {
            ...item,
            details: localize(item.details, ["title", "content"], lang),
          };
        } else if (item.item_type === "QUIZ") {
          return {
            ...item,
            details: localize(item.details, ["title", "description"], lang),
          };
        }
      }
      return item;
    });
  }
  return result;
};

export const getAllSections = asyncHandler(async (req, res, next) => {
  const result = await sectionsService.getSections({ req, res, next });
  const items = result.items?.map((s) => localizeSection(s, req.lang));
  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: { ...result, items },
  });
});

export const getSection = asyncHandler(async (req, res, next) => {
  const section = await sectionsService.getSectionById(req.params.id);
  return successResponse({
    res,
    req,
    message: "FETCH_SUCCESS",
    data: localizeSection(section, req.lang),
  });
});

export const createSection = asyncHandler(async (req, res, next) => {
  const section = await sectionsService.createSection({ req, res, next });
  return successResponse({
    res,
    req,
    message: "CREATE_SUCCESS",
    data: localizeSection(section, req.lang),
    status: 201,
  });
});

export const updateSection = asyncHandler(async (req, res, next) => {
  const section = await sectionsService.updateSection({ req, res, next });
  return successResponse({
    res,
    req,
    message: "UPDATE_SUCCESS",
    data: localizeSection(section, req.lang),
  });
});

export const deleteSection = asyncHandler(async (req, res, next) => {
  await sectionsService.deleteSection({ req, res, next });
  return successResponse({ res, req, message: "DELETE_SUCCESS" });
});

export const addSectionItems = asyncHandler(async (req, res, next) => {
  const section = await sectionsService.addSectionItems({ req, res, next });
  return successResponse({
    res,
    req,
    message: "UPDATE_SUCCESS",
    data: localizeSection(section, req.lang),
  });
});

export const removeSectionItem = asyncHandler(async (req, res, next) => {
  const section = await sectionsService.removeSectionItem({ req, res, next });
  return successResponse({
    res,
    req,
    message: "UPDATE_SUCCESS",
    data: localizeSection(section, req.lang),
  });
});
