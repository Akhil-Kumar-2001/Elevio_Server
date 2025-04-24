import { AdminWallet, IAdminWallet } from "../../../model/adminwallet/adminwallet";
import { Category, ICategory } from "../../../model/category/categoryModel";
import { Course } from "../../../model/course/courseModel";
import { Order } from "../../../model/order/orderModel";
import { IStudent, Student } from "../../../model/student/studentModel";
import { Tutor } from "../../../model/tutor/tutorModel";
import { TutorWallet } from "../../../model/wallet/walletModel";
import { CategoryIncome, DashboardData, MonthlyIncome, YearlyIncome } from "../../../Types/basicTypes";
import IAdminDashboardRepository from "../IAdminDashboardRepository";

class AdminDashboardRepository implements IAdminDashboardRepository {

    async getDashboardData(): Promise<DashboardData | null> {
        try {
            const totalStudents = await Student.countDocuments();
            const totalTutors = await Tutor.countDocuments();
            const totalCourses = await Course.countDocuments();
            const tutorIncome = await TutorWallet.aggregate([
                {
                    $group: {
                        _id: null,
                        totalIncome: { $sum: "$totalEarnings" }
                    }
                }
            ]);

            const tutorTotalIncome = tutorIncome[0]?.totalIncome || 0;
            const adminIncome = await AdminWallet.aggregate([
                {
                    $group: {
                        _id: null,
                        totalIncome: { $sum: "$totalRevenue" }
                    }
                }
            ])

            const adminTotalIncome = adminIncome[0]?.totalIncome || 0;
            const adminWallet = await AdminWallet.findOne({ email: process.env.ADMIN_MAIL });
            const adminBalance = adminWallet?.balance || 0;

            return {totalStudents,totalTutors,totalCourses,tutorTotalIncome,adminTotalIncome,adminBalance}
        } catch (error) {
            console.log("Error while retriving dashboard data in adminDashboradRepository", error);
            return null
        }
    }

    async getWallet(page:number,limit:number): Promise<IAdminWallet | null> {
        const wallet = await AdminWallet.findOne({email:process.env.ADMIN_MAIL});
        return wallet;
    }

    async getStudents(): Promise<IStudent[] | null> {
        const students = await Student.find();
        return students;
    }

    async getCategoryIncomeDistribution():Promise<CategoryIncome[] | null> {
        try {
            // Aggregation pipeline to get income by category
            const categoryIncome = await Order.aggregate([
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
                      ]}
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
          } catch (error) {
            console.error("Error fetching category income distribution:", error);
            return null
          }
    }



    async getAdminMonthlyIncome(year: number): Promise<MonthlyIncome[] | null> {
        try {
          const startDate = new Date(year, 0, 1); 
          const endDate = new Date(year, 11, 31, 23, 59, 59); 
          
          const monthlyIncome = await AdminWallet.aggregate([
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
          console.log("monthly formated data", formattedData)
          return formattedData; // Return the formatted data instead of raw aggregation result
          
        } catch (error) {
          console.error("Error fetching admin monthly income:", error);
          return null;
        }
      }

      async getAdminYearlyIncome(currentYear: number): Promise<YearlyIncome[] | null> {
        try {
          const startYear = currentYear - 5;
          const startDate = new Date(startYear, 0, 1);
          const endDate = new Date(currentYear, 11, 31, 23, 59, 59);
      
          const yearlyIncome = await AdminWallet.aggregate([
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
      
          const formattedData: YearlyIncome[] = [];
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
        } catch (error) {
          console.error("Error fetching admin yearly income:", error);
          return null;
        }
      }
      
}

export default AdminDashboardRepository