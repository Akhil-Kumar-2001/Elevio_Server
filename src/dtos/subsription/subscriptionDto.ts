export interface ISubscriptionDto {
  _id: string;
  planName: string;
  duration: {
    value: number;
    unit: "day" | "month" | "quarter" | "year";
  };
  price: number;
  features: string[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}
