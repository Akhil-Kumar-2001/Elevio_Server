
export interface IDashboardDataDto {
  totalStudents?: number;
  totalTutors?: number;
  totalCourses?: number;
  tutorTotalIncome?: number;
  adminTotalIncome?: number;
  adminBalance?: number;
}


export interface ICategoryIncomeDto {
  _id?: string
  name?: string;
  value?: number;
}


export interface IMonthlyIncomeDto {
  month: string;
  income: number;
}

export interface IYearlyIncomeDto {
  year: string;
  income: number;
}

