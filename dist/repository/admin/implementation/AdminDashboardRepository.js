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
const adminwallet_1 = require("../../../model/adminwallet/adminwallet");
const courseModel_1 = require("../../../model/course/courseModel");
const orderModel_1 = require("../../../model/order/orderModel");
const studentModel_1 = require("../../../model/student/studentModel");
const tutorModel_1 = require("../../../model/tutor/tutorModel");
const walletModel_1 = require("../../../model/wallet/walletModel");
const date_fns_1 = require("date-fns");
class AdminDashboardRepository {
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const totalStudents = yield studentModel_1.Student.countDocuments();
                const totalTutors = yield tutorModel_1.Tutor.countDocuments();
                const totalCourses = yield courseModel_1.Course.countDocuments();
                const tutorIncome = yield walletModel_1.TutorWallet.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalIncome: { $sum: "$totalEarnings" }
                        }
                    }
                ]);
                const tutorTotalIncome = ((_a = tutorIncome[0]) === null || _a === void 0 ? void 0 : _a.totalIncome) || 0;
                const adminIncome = yield adminwallet_1.AdminWallet.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalIncome: { $sum: "$totalRevenue" }
                        }
                    }
                ]);
                const adminTotalIncome = ((_b = adminIncome[0]) === null || _b === void 0 ? void 0 : _b.totalIncome) || 0;
                const adminWallet = yield adminwallet_1.AdminWallet.findOne({ email: process.env.ADMIN_MAIL });
                const adminBalance = (adminWallet === null || adminWallet === void 0 ? void 0 : adminWallet.balance) || 0;
                return { totalStudents, totalTutors, totalCourses, tutorTotalIncome, adminTotalIncome, adminBalance };
            }
            catch (error) {
                console.log("Error while retriving dashboard data in adminDashboradRepository", error);
                return null;
            }
        });
    }
    getWallet(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield adminwallet_1.AdminWallet.findOne({ email: process.env.ADMIN_MAIL });
            return wallet;
        });
    }
    getStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield studentModel_1.Student.find();
            return students;
        });
    }
    getCategoryIncomeDistribution() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Aggregation pipeline to get income by category
                const categoryIncome = yield orderModel_1.Order.aggregate([
                    // Only include successful orders
                    { $match: { status: "success" } },
                    // Unwind the courseIds array to treat each course as a separate document
                    { $unwind: "$courseIds" },
                    // Join with the courses collection to get course details
                    {
                        $lookup: {
                            from: "courses",
                            localField: "courseIds",
                            foreignField: "_id",
                            as: "courseDetails"
                        }
                    },
                    // Unwind the courseDetails array
                    { $unwind: "$courseDetails" },
                    // Join with the categories collection to get category names
                    {
                        $lookup: {
                            from: "categories",
                            localField: "courseDetails.category",
                            foreignField: "_id",
                            as: "categoryDetails"
                        }
                    },
                    // Unwind the categoryDetails array
                    { $unwind: "$categoryDetails" },
                    // Calculate the income for each course
                    // Since orders may contain multiple courses, we need to divide the order amount
                    // proportionally based on course prices
                    {
                        $lookup: {
                            from: "courses",
                            localField: "courseIds",
                            foreignField: "_id",
                            as: "allCoursesInOrder"
                        }
                    },
                    // Calculate income for this specific course in the order
                    {
                        $addFields: {
                            // Calculate the proportion of this course's price to the total order
                            courseProportion: {
                                $divide: [
                                    "$courseDetails.price",
                                    { $sum: "$allCoursesInOrder.price" }
                                ]
                            },
                            // Calculate this course's contribution to the order amount
                            courseIncome: {
                                $multiply: [
                                    "$amount",
                                    { $divide: [
                                            "$courseDetails.price",
                                            { $sum: "$allCoursesInOrder.price" }
                                        ] }
                                ]
                            }
                        }
                    },
                    // Group by category to calculate total income per category
                    {
                        $group: {
                            _id: "$categoryDetails._id",
                            name: { $first: "$categoryDetails.name" },
                            value: { $sum: "$courseIncome" }
                        }
                    },
                    // Project the final result format
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            value: 1
                        }
                    },
                    // Sort by income value in descending order
                    { $sort: { value: -1 } }
                ]);
                return categoryIncome;
            }
            catch (error) {
                console.error("Error fetching category income distribution:", error);
                return null;
            }
        });
    }
    getAdminMonthlyIncome(year) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = new Date(year, 0, 1);
                const endDate = new Date(year, 11, 31, 23, 59, 59);
                const monthlyIncome = yield adminwallet_1.AdminWallet.aggregate([
                    { $match: { isActive: true } },
                    { $unwind: "$transactions" },
                    {
                        $match: {
                            "transactions.date": { $gte: startDate, $lte: endDate },
                            "transactions.type": { $in: ["credit"] }
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
                    const monthName = new Date(year, index).toLocaleString('default', { month: 'short' });
                    // Find the month in the aggregation results
                    const monthData = monthlyIncome.find(item => item._id === month);
                    return {
                        month: monthName,
                        income: monthData ? monthData.income : 0
                    };
                });
                console.log("monthly income on repository", monthlyIncome);
                console.log("monthly formated data", formattedData);
                return formattedData; // Return the formatted data instead of raw aggregation result
            }
            catch (error) {
                console.error("Error fetching admin monthly income:", error);
                return null;
            }
        });
    }
    getAdminYearlyIncome(currentYear) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startYear = currentYear - 5;
                const startDate = new Date(startYear, 0, 1);
                const endDate = new Date(currentYear, 11, 31, 23, 59, 59);
                const yearlyIncome = yield adminwallet_1.AdminWallet.aggregate([
                    { $match: { isActive: true } },
                    { $unwind: "$transactions" },
                    {
                        $match: {
                            "transactions.date": { $gte: startDate, $lte: endDate },
                            "transactions.type": { $in: ["credit"] }
                        }
                    },
                    {
                        $project: {
                            year: { $year: "$transactions.date" },
                            amount: "$transactions.amount"
                        }
                    },
                    {
                        $group: {
                            _id: "$year",
                            income: { $sum: "$amount" }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]);
                const formattedData = [];
                for (let y = startYear; y <= currentYear; y++) {
                    const data = yearlyIncome.find(item => item._id === y);
                    formattedData.push({
                        year: y.toString(),
                        income: data ? data.income : 0
                    });
                }
                console.log("yearly income on repository", yearlyIncome);
                console.log("formatted yearly data", formattedData);
                return formattedData;
            }
            catch (error) {
                console.error("Error fetching admin yearly income:", error);
                return null;
            }
        });
    }
    getAdminIncomeByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Parse the input dates
                const start = (0, date_fns_1.parseISO)(startDate);
                const end = (0, date_fns_1.parseISO)(endDate);
                // Validate dates
                if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
                    console.error('Invalid date range');
                    return null;
                }
                // Find the admin wallet (assuming there's a single admin wallet or you filter by email)
                const adminWallet = yield adminwallet_1.AdminWallet.findOne({ isActive: true }).lean();
                if (!adminWallet) {
                    console.error('No active admin wallet found');
                    return null;
                }
                // Filter transactions within the date range and of type 'credit' or 'commission'
                const incomeTransactions = adminWallet.transactions.filter((transaction) => transaction.date >= start &&
                    transaction.date <= end &&
                    ['credit', 'commission'].includes(transaction.type));
                // If no transactions found, return an empty array or null
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
                console.error('Error fetching admin income by date range:', error);
                return null;
            }
        });
    }
}
exports.default = AdminDashboardRepository;
