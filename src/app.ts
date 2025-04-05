import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./Config/dbConfig";
import studentRouter from "./routes/student/studentRouter";
import tutorRouter from "./routes/tutor/tutorRouter";
import adminRouter from "./routes/admin/adminRouter";
import cookieParser from "cookie-parser";
import morganMiddleware from "./middleware/morganMiddleware";


dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000","https://api.razorpay.com"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

const PORT = process.env.PORT || 4000;

// Connect to Database
connectDb();


// Routes
app.use("/api/student", studentRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/admin", adminRouter);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Error handling middleware's errro in the app.ts file",err);
  res.status(500).json({ message: "Internal server error" });
  next()
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
