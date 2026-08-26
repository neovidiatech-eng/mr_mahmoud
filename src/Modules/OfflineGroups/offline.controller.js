
import * as offlineService from "./offline.service.js";
import { asyncHandler, successResponse } from "../../Utils/Response.js";

export const createOfflineGroup = asyncHandler(async (req, res, next) => {
  const { stageId, courseIds } = req.body;

  const group = await offlineService.createGroup({
    stageId,
    courseIds,
  });

  return successResponse({
    res,
    req,
    status: 201,
    message: "OFFLINE_GROUP_CREATED",
    data: { group },
  });
});

export const getAllOfflineGroups = asyncHandler(async (req, res, next) => {
  const groups = await offlineService.getAllgroups();

  return successResponse({
    res,
    req,
    status: 200,
    message: "OFFLINE_GROUPS_FETCHED_SUCCESSFULLY",
    data: groups,
  });
});

export const getGroupById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const group = await offlineService.getGroup({ id });

  return successResponse({
    res,
    req,
    status: 200,
    message: "OFFLINE_GROUP_FETCHED_SUCCESSFULLY",
    data: { group },
  });
});

export const deleteOfflineGroup = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  await offlineService.deleteGroup({ id });

  return successResponse({
    res,
    req,
    status: 200,
    message: "OFFLINE_GROUP_DELETED_SUCCESSFULLY",
  });
});

export const updateOfflineGroup = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { courseIds, qrActive } = req.body;

  const group = await offlineService.updateGroup({
    id,
    courseIds,
    qrActive,
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "OFFLINE_GROUP_UPDATED_SUCCESSFULLY",
    data: { group },
  });
});

export const scanForOfflineGroup = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  const courses = await offlineService.scanGroup({
    qrToken: token,
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "COURSES_FETCHED_SUCCESSFULLY",
    data: { courses },
  });
});     