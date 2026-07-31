import {
  errorResponse,
  successResponse,
  asyncHandler,
} from "../../Utils/Response.js";
import * as db from "../../database/dbService.js";

/* ------------------------------------------------------------------ */
/*                  Teacher requests a withdrawal                     */
/* ------------------------------------------------------------------ */
export const requestWithdrawal = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  const teacherId = req.user.id;

  // Run the balance check and request creation inside a single transaction so
  // two concurrent requests can't both read the same "available" balance and
  // both pass the check before either commits.
  const request = await db.transaction(async (tx) => {
    // 1. Get teacher wallet
    const wallet = await tx.findFirst({
      model: "Wallet",
      where: { userId: teacherId, type: "teacher" },
    });

    if (!wallet) {
      const error = new Error("WALLET_NOT_FOUND");
      error.status = 404;
      error.isMessageKey = true;
      throw error;
    }

    // 2. Balance still locked in other pending requests must be reserved too,
    //    otherwise a teacher can open several pending requests that
    //    individually look affordable but together exceed the real balance.
    const pendingRequests = await tx.findMany({
      model: "WithdrawalRequest",
      where: { teacherId, status: "pending" },
    });
    const pendingAmount = pendingRequests.reduce((sum, r) => sum + r.amount, 0);
    const available = wallet.balance - pendingAmount;

    if (available < amount) {
      const error = new Error("INSUFFICIENT_BALANCE");
      error.status = 400;
      error.isMessageKey = true;
      error.messageParams = { available, required: amount };
      throw error;
    }

    // 3. Create request
    return tx.create({
      model: "WithdrawalRequest",
      data: {
        teacherId,
        amount,
        currencyId: wallet.currencyId,
        status: "pending",
      },
    });
  });

  return successResponse({
    res,
    req,
    status: 201,
    message: "REQUEST_SUBMITTED",
    data: { request },
  });
});

export const getWithdrawals = asyncHandler(async (req, res, next) => {
  const teacherId = req.user.id;
  const wallet = await db.findFirst({
    model: "Wallet",
    where: { userId: teacherId, type: "teacher" },
  });
  if (!wallet) {
    return errorResponse({
      req,
      next,
      status: 404,
      message: "WALLET_NOT_FOUND",
    });
  }
  const withdrawals = await db.findMany({
    model: "WithdrawalRequest",
    where: { teacherId },
    include: {
      currency: true,
    },
  });
  return successResponse({
    res,
    req,
    status: 200,
    message: "FETCH_SUCCESS",
    data: { withdrawals },
  });
});

export const getAllWithdrawals = asyncHandler(async (req, res, next) => {
  const withdrawals = await db.findMany({
    model: "WithdrawalRequest",
    include: {
      teacher: true,
      currency: true,
    },
  });
  return successResponse({
    res,
    req,
    status: 200,
    message: "FETCH_SUCCESS",
    data: { withdrawals },
  });
});

/* ------------------------------------------------------------------ */
/*                  Admin approves a withdrawal                       */
/* ------------------------------------------------------------------ */
export const approveWithdrawal = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  // 1. Find request
  const request = await db.findOne({
    model: "WithdrawalRequest",
    where: { id },
  });

  if (!request) {
    return errorResponse({
      req,
      next,
      status: 404,
      message: "REQUEST_NOT_FOUND",
    });
  }

  if (request.status !== "pending") {
    return errorResponse({
      req,
      next,
      status: 400,
      message: "REQUEST_ALREADY_PROCESSED",
    });
  }

  // 2. Atomic Transaction for Safety
  const result = await db.transaction(async (tx) => {
    // 2.a Claim the request atomically: only one of two concurrent approve
    // calls for the same request can flip it out of "pending" here, closing
    // the double-approval race before any money moves.
    const { count: claimed } = await tx.updateMany({
      model: "WithdrawalRequest",
      where: { id: request.id, status: "pending" },
      data: { status: "approved", adminNotes },
    });

    if (claimed === 0) {
      const error = new Error("REQUEST_ALREADY_PROCESSED");
      error.isMessageKey = true;
      throw error;
    }

    // 2.b Re-check balance (Double check for race conditions)
    const wallet = await tx.findFirst({
      model: "Wallet",
      where: { userId: request.teacherId, type: "teacher" },
    });

    if (!wallet || wallet.balance < request.amount) {
      const error = new Error("INSUFFICIENT_BALANCE");
      error.isMessageKey = true;
      throw error;
    }

    // 2.b Deduct Balance atomically: the WHERE clause re-verifies the
    // balance at the moment the row is actually locked/written, so two
    // concurrent approvals can't both decrement from the same stale read.
    const { count } = await tx.updateMany({
      model: "Wallet",
      where: { id: wallet.id, balance: { gte: request.amount } },
      data: { balance: { decrement: request.amount } },
    });

    if (count === 0) {
      const error = new Error("INSUFFICIENT_BALANCE");
      error.isMessageKey = true;
      throw error;
    }

    // 2.c Create Payout Transaction (Ledger)
    const transaction = await tx.create({
      model: "Transaction",
      data: {
        walletId: wallet.id,
        type: "withdrawal",
        amount: request.amount,
        withdrawalRequestId: request.id,
        reason: req.t("WITHDRAWAL_PAYOUT_REASON", { id: request.id }),
        status: "completed",
      },
    });

    return tx.findFirst({
      model: "WithdrawalRequest",
      where: { id: request.id },
    });
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "REQUEST_APPROVED",
    data: { request: result },
  });
});

/* ------------------------------------------------------------------ */
/*                  Admin rejects a withdrawal                        */
/* ------------------------------------------------------------------ */
export const rejectWithdrawal = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  // 1. Find request
  const request = await db.findOne({
    model: "WithdrawalRequest",
    where: { id },
  });

  if (!request) {
    return errorResponse({
      req,
      next,
      status: 404,
      message: "REQUEST_NOT_FOUND",
    });
  }

  if (request.status !== "pending") {
    return errorResponse({
      req,
      next,
      status: 400,
      message: "REQUEST_ALREADY_PROCESSED",
    });
  }

  // 2. Update Status
  const updatedRequest = await db.updateOne({
    model: "WithdrawalRequest",
    where: { id },
    data: {
      status: "rejected",
      adminNotes,
    },
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "REQUEST_REJECTED",
    data: { request: updatedRequest },
  });
});
