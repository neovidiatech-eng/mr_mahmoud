
import * as offlineService from "./offline.service.js";
import { asyncHandler } from "../../Utils/AsyncHandler.js";

export const createOfflineGroup =  asyncHandler(async (req, res, next) => {
    const { rankId, courseIds } = req.body;

    const group = await offlineService.createGroup({
        rankId,
        courseIds,
 });
    return res.status(201).json({
        message:"OFFLINE_GROUP_CREATED",
        status:201,
        data:group
    })
})

export const getAllOfflineGroups = asyncHandler(async (req, res, next) => {
    const groups = await offlineService.getAllgroups();
    return res.status(200).json({
        message:"OFFLINE_GROUPS_FETCHED_SUCCESSFULLY",
        status:200,
        data:groups
    })
})

export const getGroupById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const group = await offlineService.getGroup({id});
    return res.status(200).json({
        message:"OFFLINE_GROUP_FETCHED_SUCCESSFULLY",
        status:200,
        data:group
    })
})

export const deleteOfflineGroup = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const group = await offlineService.deleteGroup({id});
    return res.status(200).json({
        message:"OFFLINE_GROUP_DELETED_SUCCESSFULLY",
        status:200,
        data:group
    })
})

export const updateOfflineGroup = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { courseIds, isActive } = req.body;

  const group = await offlineService.updateGroup({ id, courseIds, isActive });
  return res.status(200).json({
    message: "OFFLINE_GROUP_UPDATED_SUCCESSFULLY",
    status: 200,
    data: group,
  });
});
