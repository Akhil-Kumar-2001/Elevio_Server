import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import http from 'http';
import dotenv from "dotenv";
import connectDb from "./Config/dbConfig";
import studentRouter from "./routes/student/studentRouter";
import tutorRouter from "./routes/tutor/tutorRouter";
import adminRouter from "./routes/admin/adminRouter";
import chatRouter from "./routes/chat/chatRouter";
import cookieParser from "cookie-parser";
import configureSocket from "./Config/socketConfig";
import morganMiddleware from "./middleware/morganMiddleware";


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = configureSocket(server)
// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || [],
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
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running ✅");
});

app.use("/api/student", studentRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat",chatRouter);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Error handling middleware's errro in the app.ts file",err);
  res.status(500).json({ message: "Internal server error" });
  next()
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
