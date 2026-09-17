import { asyncHandler, successResponse, errorResponse } from "../../Utils/Response.js";
import * as db from "../../database/dbService.js";

export const getSettings = asyncHandler(async (req, res, next) => {
    let settings = await db.findFirst({
        model: "settings"
    });

    if (!settings) {
        settings = await db.create({
            model: "settings",
            data: {
                userPrefix: "mr_mahmoud",
                socialLinks: {},
                contactInfo: {},
                paymentMethods: {}
            }
        });
    }

    return successResponse({
        res,
        req,
        message: "FETCH_SUCCESS",
        data: settings,
        status: 200
    });
});
export const getPaymentMethods = asyncHandler(async (req, res, next) => {
    let settings = await db.findFirst({
        model: "settings"
    });
    



    return successResponse({
        res,
        req,
        message: "FETCH_SUCCESS",
        data: settings.paymentMethods,
        status: 200
    });
});

export const updateSettings = asyncHandler(async (req, res, next) => {
    const { userPrefix, socialLinks, contactInfo, paymentMethods } = req.body;

    let settings = await db.findFirst({
        model: "settings"
    });

    if (!settings) {
        settings = await db.create({
            model: "settings",
            data: {
                userPrefix: userPrefix || "mr_mahmoud",
                socialLinks: socialLinks || {},
                contactInfo: contactInfo || {},
                paymentMethods: paymentMethods || {}
            }
        });
    } else {
        const data = {};
        if (userPrefix !== undefined) data.userPrefix = userPrefix;
        if (socialLinks !== undefined) data.socialLinks = socialLinks;
        if (contactInfo !== undefined) data.contactInfo = contactInfo;
        if (paymentMethods !== undefined) data.paymentMethods = paymentMethods;

        settings = await db.updateOne({
            model: "settings",
            where: { id: settings.id },
            data
        });
    }

    return successResponse({
        res,
        req,
        message: "UPDATE_SUCCESS",
        data: settings,
        status: 200
    });
});

