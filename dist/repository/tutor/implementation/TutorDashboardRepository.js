"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const courseModel_1 = require("../../../model/course/courseModel");
const walletModel_1 = require("../../../model/wallet/walletModel");
const mongoose_1 = require("mongoose");
const date_fns_1 = require("date-fns");
class TutorDashboardRepository {
    getMonthlyIncome(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get current year
                const currentYear = new Date().getFullYear();
                const startDate = new Date(currentYear, 0, 1);
                const endDate = new Date(currentYear, 11, 31, 23, 59, 59);
                // Convert string ID to ObjectId
                const tutorObjectId = new mongoose_1.Types.ObjectId(tutorId);
                const monthlyIncome = yield walletModel_1.TutorWallet.aggregate([
                    { $match: { tutorId: tutorObjectId, isActive: true } },
                    { $unwind: "$transactions" },
                    {
                        $match: {
                            "transactions.date": { $gte: startDate, $lte: endDate },
                            "transactions.type": "credit" // Only count credits as income
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            month: { $month: "$transactions.date" },
                            amount: "$transactions.amount"
                        }
                    },
                    {
                        $group: {
                            _id: "$month",
                            income: { $sum: "$amount" }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]);
                // Format the results to include all months of the year
                const formattedData = new Array(12).fill(0).map((_, index) => {
                    const month = index + 1;
                    const monthName = new Date(currentYear, index).toLocaleString('default', { month: 'short' });
                    // Find the month in the aggregation results
                    const monthData = monthlyIncome.find(item => item._id === month);
                    return {
                        month: monthName,
                        income: monthData ? monthData.income : 0
                    };
                });
                console.log("Monthly income for tutor:", tutorId, formattedData);
                return formattedData;
            }
            catch (error) {
                console.error("Error fetching tutor monthly income:", error);
                return null;
            }
        });
    }
    // async getYearlyIncome(tutorId: string): Promise<YearlyIncome[] | null> {
    //   try {
    //     // Convert string ID to ObjectId
    //     const tutorObjectId = new Types.ObjectId(tutorId);
    //     const yearlyIncome = await TutorWallet.aggregate([
    //       { $match: { tutorId: tutorObjectId, isActive: true } },
    //       { $unwind: "$transactions" },
    //       {
    //         $match: {
    //           "transactions.type": "credit" // Only count credits as income
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           year: { $year: "$transactions.date" },
    //           amount: "$transactions.amount"
    //         }
    //       },
    //       {
    //         $group: {
    //           _id: "$year",
    //           income: { $sum: "$amount" }
    //         }
    //       },
    //       { $sort: { _id: 1 } }
    //     ]);
    //     // Format the results
    //     const formattedData = yearlyIncome.map(item => ({
    //       year: item._id,
    //       income: item.income
    //     }));
    //     console.log("Yearly income for tutor:", tutorId, formattedData);
    //     return formattedData;
    //   } catch (error) {
    //     console.error("Error fetching tutor yearly income:", error);
    //     return null;
    //   }
    // }
    getYearlyIncome(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tutorObjectId = new mongoose_1.Types.ObjectId(tutorId);
                const currentYear = new Date().getFullYear(); // 2025
                const yearsRange = Array.from({ length: 5 }, (_, i) => currentYear - (4 - i)); // [2021, 2022, 2023, 2024, 2025]
                const yearlyIncome = yield walletModel_1.TutorWallet.aggregate([
                    // Match the tutor and active transactions
                    { $match: { tutorId: tutorObjectId, isActive: true } },
                    { $unwind: "$transactions" },
                    {
                        $match: {
                            "transactions.type": "credit", // Only count credits as income
                            "transactions.date": { $lte: new Date() } // Filter out future dates
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            year: { $year: "$transactions.date" },
                            amount: "$transactions.amount",
                            fullDate: "$transactions.date" // For debugging
                        }
                    },
                    {
                        $group: {
                            _id: "$year",
                            income: { $sum: "$amount" },
                            transactions: { $push: { date: "$fullDate", amount: "$amount" } } // Debug: Capture transactions
                        }
                    },
                    // Log the grouped data before facet
                    {
                        $facet: {
                            incomeData: [{ $project: { _id: 1, income: 1, transactions: 1 } }], // Capture grouped data
                            allYears: [
                                {
                                    $project: {
                                        year: { $literal: yearsRange }
                                    }
                                },
                                { $unwind: "$year" }
                            ]
                        }
                    },
                    {
                        $project: {
                            results: {
                                $map: {
                                    input: "$allYears",
                                    as: "yearObj",
                                    in: {
                                        year: "$$yearObj.year",
                                        income: {
                                            $let: {
                                                vars: {
                                                    incomeIndex: { $indexOfArray: ["$incomeData._id", "$$yearObj.year"] }
                                                },
                                                in: {
                                                    $cond: {
                                                        if: { $gte: ["$$incomeIndex", 0] },
                                                        then: { $arrayElemAt: ["$incomeData.income", "$$incomeIndex"] },
                                                        else: 0
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            debug: "$incomeData" // Capture debug data
                        }
                    },
                    { $unwind: "$results" },
                    { $replaceRoot: { newRoot: "$results" } },
                    { $sort: { year: 1 } }
                ]);
                // Log debug data
                console.log("Debug data for tutor:", tutorId, (_a = yearlyIncome[0]) === null || _a === void 0 ? void 0 : _a.debug);
                const formattedData = yearlyIncome.length > 0 ? yearlyIncome : yearsRange.map(year => ({ year, income: 0 }));
                // Ensure all years are present
                const finalData = yearsRange.map(year => {
                    const found = formattedData.find((item) => item.year === year);
                    return found || { year, income: 0 };
                });
                console.log("Yearly income for tutor:", tutorId, finalData);
                return finalData;
            }
            catch (error) {
                console.error("Error fetching tutor yearly income:", error);
                return null;
            }
        });
    }
    getStudentsCount(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert string ID to ObjectId
                const tutorObjectId = new mongoose_1.Types.ObjectId(tutorId);
                // Find all courses by this tutor
                const courses = yield courseModel_1.Course.find({
                    tutorId: tutorObjectId,
                    status: "listed" // Only count published/listed courses
                }).select('title purchasedStudents');
                // Format the results
                const studentsCount = courses.map(course => {
                    var _a;
                    return ({
                        name: course.title,
                        students: ((_a = course.purchasedStudents) === null || _a === void 0 ? void 0 : _a.length) || 0
                    });
                });
                console.log("Students count for tutor:", tutorId, studentsCount);
                return studentsCount;
            }
            catch (error) {
                console.error("Error fetching students count:", error);
                return null;
            }
        });
    }
    getTransactions(tutorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate inputs
                if (!mongoose_1.Types.ObjectId.isValid(tutorId)) {
                    throw new Error("Invalid tutorId");
                }
                if (page < 1 || limit < 1) {
                    throw new Error("Page and limit must be positive numbers");
                }
                // Find the tutor's wallet
                const wallet = yield walletModel_1.TutorWallet.findOne({ tutorId: new mongoose_1.Types.ObjectId(tutorId) });
                if (!wallet) {
                    return null;
                }
                // Calculate skip value for pagination
                const skip = (page - 1) * limit;
                // Get total number of transactions
                const total = wallet.transactions.length;
                // Sort transactions by date (newest first) and paginate
                const transactions = wallet.transactions
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(skip, skip + limit);
                return { transactions, total };
            }
            catch (error) {
                console.error("Error fetching transaction details:", error);
                return null;
            }
        });
    }
    getDashboradDetails(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield courseModel_1.Course.find({ tutorId });
                const courseCount = courses.length;
                const studentSet = new Set();
                courses.forEach(course => {
                    var _a;
                    (_a = course.purchasedStudents) === null || _a === void 0 ? void 0 : _a.forEach(studentId => {
                        studentSet.add(studentId.toString());
                    });
                });
                const totalStudents = studentSet.size;
                const wallet = yield walletModel_1.TutorWallet.findOne({ tutorId });
                let totalIncome = 0;
                let totalTransactions = 0;
                let lastTransactionDate = null;
                if (wallet) {
                    totalTransactions = wallet.transactions.length;
                    totalIncome = wallet.transactions
                        .filter(txn => txn.type === "credit")
                        .reduce((sum, txn) => sum + txn.amount, 0);
                    lastTransactionDate = wallet.lastTransactionDate || null;
                }
                return {
                    courseCount,
                    totalStudents,
                    totalIncome,
                    totalTransactions,
                    lastTransactionDate
                };
            }
            catch (error) {
                console.error("Error fetching dashboard details:", error);
                return null;
            }
        });
    }
    getIncomeByDateRange(tutorId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert Date objects to ISO strings for consistency
                const start = startDate;
                const end = endDate;
                // Validate dates
                if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
                    console.error('Invalid date range');
                    return null;
                }
                // Find the tutor wallet by tutorId
                const tutorWallet = yield walletModel_1.TutorWallet.findOne({ tutorId: tutorId, isActive: true }).lean();
                if (!tutorWallet) {
                    console.error('No active tutor wallet found for the given tutorId');
                    return null;
                }
                // Filter transactions within the date range and of type 'credit' (or other income types)
                const incomeTransactions = tutorWallet.transactions.filter((transaction) => transaction.date >= start &&
                    transaction.date <= end &&
                    ['credit'].includes(transaction.type) // Adjust types as needed (e.g., add 'commission')
                );
                // If no transactions found, return an empty array
                if (!incomeTransactions.length) {
                    return [];
                }
                // Group transactions by month
                const monthlyIncomeMap = {};
                // Generate all months in the date range to ensure every month is represented
                const monthsInRange = (0, date_fns_1.eachMonthOfInterval)({ start, end });
                // Initialize the map with zero income for each month
                monthsInRange.forEach((month) => {
                    const monthKey = (0, date_fns_1.format)(month, 'MMMM yyyy'); // e.g., "January 2025"
                    monthlyIncomeMap[monthKey] = 0;
                });
                // Aggregate income by month
                incomeTransactions.forEach((transaction) => {
                    const monthKey = (0, date_fns_1.format)(transaction.date, 'MMMM yyyy');
                    monthlyIncomeMap[monthKey] = (monthlyIncomeMap[monthKey] || 0) + transaction.amount;
                });
                // Convert the map to the MonthlyIncome array format
                const monthlyIncome = Object.entries(monthlyIncomeMap).map(([month, income]) => ({
                    month,
                    income,
                }));
                // Sort by month for consistent display
                monthlyIncome.sort((a, b) => {
                    const dateA = (0, date_fns_1.parseISO)(a.month);
                    const dateB = (0, date_fns_1.parseISO)(b.month);
                    return dateA.getTime() - dateB.getTime();
                });
                return monthlyIncome;
            }
            catch (error) {
                console.error('Error fetching tutor income by date range:', error);
                return null;
            }
        });
    }
}
exports.default = TutorDashboardRepository;
