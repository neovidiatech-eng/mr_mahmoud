import { asyncHandler, successResponse } from "../../../Utils/Response.js";
import * as stageService from "./stages.service.js";

export const createStage = asyncHandler(async (req, res, next) => {
  const stage = await stageService.createStage(req.body);

  return successResponse({
    res,
    req,
    status: 201,
    data: { stage },
    message: "STAGE_CREATED_SUCCESSFULLY",
  });
});

export const getAllStages = asyncHandler(async (req, res, next) => {
  const result = await stageService.getAllStages(req.query);

  return successResponse({
    res,
    req,
    status: 200,
    data: result,
    message: "STAGES_FETCHED_SUCCESSFULLY",
  });
});

export const getStageById = asyncHandler(async (req, res, next) => {
  const stage = await stageService.getStageById({ id: req.params.id });

  return successResponse({
    res,
    req,
    status: 200,
    data: { stage },
    message: "STAGE_FETCHED_SUCCESSFULLY",
  });
});

export const updateStage = asyncHandler(async (req, res, next) => {
  const stage = await stageService.updateStage({
    id: req.params.id,
    ...req.body,
  });

  return successResponse({
    res,
    req,
    status: 200,
    data: { stage },
    message: "STAGE_UPDATED_SUCCESSFULLY",
  });
});

export const deleteStage = asyncHandler(async (req, res, next) => {
  await stageService.deleteStage({ id: req.params.id });

  return successResponse({
    res,
    req,
    status: 200,
    data: null,
    message: "STAGE_DELETED_SUCCESSFULLY",
  });
});