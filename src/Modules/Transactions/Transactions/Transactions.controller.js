import {
  asyncHandler,
  errorResponse,
  successResponse,
} from "../../../Utils/Response.js";
import * as db from "../../../database/dbService.js";

export const getTransactions = asyncHandler(async (req, res) => {
  const { currency, page, limit, type, status, search } = req.query;

  // 1. Build filter
  const where = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { reason: { contains: search, mode: "insensitive" } },
      { id: { contains: search, mode: "insensitive" } },
    ];
  }

  // 2. Fetch transactions with pagination
  const { items: transactions, pagination } = await db.findManyWithPaginationAndCount({
    model: "transaction",
    where,
    page,
    limit,
    include: {
      wallet: {
        include: {
          currency: true
        }
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Fetch default currency
  const defaultCurrency = await db.findFirst({
    model: "currency",
    where: { default: true },
  });

  if (!defaultCurrency) {
    return errorResponse({
      res,
      message: "DEFAULT_CURRENCY_NOT_FOUND",
      status: 500,
    });
  }

  // 4. Fetch target currency
  let targetCurrency = defaultCurrency;
  if (currency) {
    const foundCurrency = await db.findFirst({
      model: "currency",
      where: { code: currency },
    });
    if (foundCurrency) {
      targetCurrency = foundCurrency;
    }
  }

  // 5. Convert transactions
  const convertedTransactions = transactions.map((transaction) => {
    const amount = transaction.amount;
    
    // Formula: convertedAmount = (amount / defaultCurrency.exchangeRate) * targetCurrency.exchangeRate
    const convertedAmount = (amount / defaultCurrency.exchangeRate) * targetCurrency.exchangeRate;

    return {
      id: transaction.id,
      walletId: transaction.walletId,
      type: transaction.type,
      status: transaction.status,
      reason: transaction.reason,
      createdAt: transaction.createdAt,
      originalAmount: amount, // default currency
      convertedAmount: Number(convertedAmount.toFixed(2)), // requested currency
      currencyCode: targetCurrency.code,
      exchangeRateUsed: targetCurrency.exchangeRate,
    };
  });

  return successResponse({
    res,
    message: "TRANSACTIONS_FETCHED_SUCCESSFULLY",
    data: {
      transactions: convertedTransactions,
      pagination,
    },
  });
});

export const getTransactionStats = asyncHandler(async (req, res) => {
  const { currency } = req.query;

  // 1. Fetch default currency
  const defaultCurrency = await db.findFirst({
    model: "currency",
    where: { default: true },
  });

  if (!defaultCurrency) {
    return errorResponse({
      res,
      message: "DEFAULT_CURRENCY_NOT_FOUND",
      status: 500,
    });
  }

  // 2. Fetch target currency
  let targetCurrency = defaultCurrency;
  if (currency) {
    const foundCurrency = await db.findFirst({
      model: "currency",
      where: { code: currency },
    });
    if (foundCurrency) {
      targetCurrency = foundCurrency;
    }
  }

  // 3. Fetch transactions with their wallet's currency, since amount is stored
  //    in the wallet's own currency and wallets can differ in currency —
  //    raw amounts cannot be summed across wallets before normalizing.
  const transactions = await db.findMany({
    model: "transaction",
    where: { status: { in: ["completed", "pending"] } },
    select: {
      amount: true,
      type: true,
      status: true,
      wallet: { select: { currency: { select: { exchangeRate: true } } } },
    },
  });

  let totalRevenue = 0;
  let totalExpenses = 0;
  let completedCount = 0;
  let pendingCount = 0;

  transactions.forEach((t) => {
    if (t.status === "completed") {
      completedCount += 1;
      // Normalize this transaction's amount into the default currency
      // before adding it to the running totals.
      const walletRate = t.wallet?.currency?.exchangeRate || defaultCurrency.exchangeRate;
      const normalizedAmount = (t.amount / walletRate) * defaultCurrency.exchangeRate;

      // Revenue types
      if (["subscription", "credit"].includes(t.type)) {
        totalRevenue += normalizedAmount;
      }
      // Expense types
      else if (["expense", "debit", "withdrawal"].includes(t.type)) {
        totalExpenses += normalizedAmount;
      }
    } else if (t.status === "pending") {
      pendingCount += 1;
    }
  });

  const netProfit = totalRevenue - totalExpenses;

  // 4. Helper for conversion
  const convert = (val) => 
    Number(((val / defaultCurrency.exchangeRate) * targetCurrency.exchangeRate).toFixed(2));

  return successResponse({
    res,
    message: "STATS_FETCHED_SUCCESSFULLY",
    data: {
      totalRevenue: convert(totalRevenue),
      totalExpenses: convert(totalExpenses),
      netProfit: convert(netProfit),
      completedTransactions: completedCount,
      pendingTransactions: pendingCount,
      currencyCode: targetCurrency.code,
    },
  });
});