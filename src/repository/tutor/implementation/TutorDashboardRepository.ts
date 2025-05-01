import { Course } from "../../../model/course/courseModel";
import { ITransaction, TutorWallet } from "../../../model/wallet/walletModel";
import { IDashboardDetails, MonthlyIncome, StudentsCount, YearlyIncome } from "../../../Types/basicTypes";
import { TutorTransaction } from "../../../Types/CategoryReturnType";
import ITutorDashboardRepository from "../ITutorDashboardRepository";
import { Types } from 'mongoose'
import { parseISO, format, eachMonthOfInterval } from 'date-fns';

class TutorDashboardRepository implements ITutorDashboardRepository {

  async getMonthlyIncome(tutorId: string): Promise<MonthlyIncome[] | null> {
    try {
      // Get current year
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, 0, 1);
      const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

      // Convert string ID to ObjectId
      const tutorObjectId = new Types.ObjectId(tutorId);

      const monthlyIncome = await TutorWallet.aggregate([
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

    } catch (error) {
      console.error("Error fetching tutor monthly income:", error);
      return null;
    }
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


  async getYearlyIncome(tutorId: string): Promise<YearlyIncome[] | null> {
    try {
      const tutorObjectId = new Types.ObjectId(tutorId);
  
      const currentYear = new Date().getFullYear(); // 2025
      const yearsRange = Array.from({ length: 5 }, (_, i) => currentYear - (4 - i)); // [2021, 2022, 2023, 2024, 2025]
  
      const yearlyIncome = await TutorWallet.aggregate([
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
      console.log("Debug data for tutor:", tutorId, yearlyIncome[0]?.debug);
  
      const formattedData = yearlyIncome.length > 0 ? yearlyIncome : yearsRange.map(year => ({ year, income: 0 }));
  
      // Ensure all years are present
      const finalData = yearsRange.map(year => {
        const found = formattedData.find((item: any) => item.year === year);
        return found || { year, income: 0 };
      });
  
      console.log("Yearly income for tutor:", tutorId, finalData);
      return finalData;
  
    } catch (error) {
      console.error("Error fetching tutor yearly income:", error);
      return null;
    }
  }
  


  async getStudentsCount(tutorId: string): Promise<StudentsCount[] | null> {
    try {
      // Convert string ID to ObjectId
      const tutorObjectId = new Types.ObjectId(tutorId);

      // Find all courses by this tutor
      const courses = await Course.find({
        tutorId: tutorObjectId,
        status: "listed" // Only count published/listed courses
      }).select('title purchasedStudents');

      // Format the results
      const studentsCount: StudentsCount[] = courses.map(course => ({
        name: course.title,
        students: course.purchasedStudents?.length || 0
      }));

      console.log("Students count for tutor:", tutorId, studentsCount);
      return studentsCount;

    } catch (error) {
      console.error("Error fetching students count:", error);
      return null;
    }
  }


  async getTransactions(tutorId: string, page: number, limit: number): Promise<TutorTransaction | null> {
    try {
      // Validate inputs
      if (!Types.ObjectId.isValid(tutorId)) {
        throw new Error("Invalid tutorId");
      }
      if (page < 1 || limit < 1) {
        throw new Error("Page and limit must be positive numbers");
      }

      // Find the tutor's wallet
      const wallet = await TutorWallet.findOne({ tutorId: new Types.ObjectId(tutorId) });

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
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return null;
    }
  }

  async getDashboradDetails(tutorId: string): Promise<IDashboardDetails | null> {
    try {
      const courses = await Course.find({ tutorId });

      const courseCount = courses.length;

      const studentSet = new Set<string>();

      courses.forEach(course => {
        course.purchasedStudents?.forEach(studentId => {
          studentSet.add(studentId.toString());
        });
      });

      const totalStudents = studentSet.size;

      const wallet = await TutorWallet.findOne({ tutorId });
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
      }

      

    } catch (error) {
      console.error("Error fetching dashboard details:", error);
      return null;
    }
  }

  async getIncomeByDateRange(tutorId: string, startDate: Date, endDate: Date): Promise<MonthlyIncome[] | null> {
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
      const tutorWallet = await TutorWallet.findOne({ tutorId: tutorId, isActive: true }).lean();
      if (!tutorWallet) {
        console.error('No active tutor wallet found for the given tutorId');
        return null;
      }
  
      // Filter transactions within the date range and of type 'credit' (or other income types)
      const incomeTransactions = tutorWallet.transactions.filter(
        (transaction) =>
          transaction.date >= start &&
          transaction.date <= end &&
          ['credit'].includes(transaction.type) // Adjust types as needed (e.g., add 'commission')
      );
  
      // If no transactions found, return an empty array
      if (!incomeTransactions.length) {
        return [];
      }
  
      // Group transactions by month
      const monthlyIncomeMap: { [key: string]: number } = {};
  
      // Generate all months in the date range to ensure every month is represented
      const monthsInRange = eachMonthOfInterval({ start, end });
  
      // Initialize the map with zero income for each month
      monthsInRange.forEach((month) => {
        const monthKey = format(month, 'MMMM yyyy'); // e.g., "January 2025"
        monthlyIncomeMap[monthKey] = 0;
      });
  
      // Aggregate income by month
      incomeTransactions.forEach((transaction) => {
        const monthKey = format(transaction.date, 'MMMM yyyy');
        monthlyIncomeMap[monthKey] = (monthlyIncomeMap[monthKey] || 0) + transaction.amount;
      });
  
      // Convert the map to the MonthlyIncome array format
      const monthlyIncome: MonthlyIncome[] = Object.entries(monthlyIncomeMap).map(([month, income]) => ({
        month,
        income,
      }));
  
      // Sort by month for consistent display
      monthlyIncome.sort((a, b) => {
        const dateA = parseISO(a.month);
        const dateB = parseISO(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  
      return monthlyIncome;
    } catch (error) {
      console.error('Error fetching tutor income by date range:', error);
      return null;
    }
  }

}

export default TutorDashboardRepository;