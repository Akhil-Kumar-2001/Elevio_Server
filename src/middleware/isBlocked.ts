import { Model } from "mongoose"; // Import Model type
import { Tutor, TutorType } from "../model/tutor/tutorModel"; // Import Tutor model and type
import { Student, StudentType } from "../model/student/studentModel"; // Import Student model and type
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const isBlocked = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const JWT_KEY = process.env.JWT_SECRET as string;

    if (!JWT_KEY) {
      res.status(500).json({ message: "Server error: Missing JWT secret key." });
      return;
    }

    const accessToken = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    if (!accessToken) {
      res.status(401).json({ message: "Access token not found, please log in" });
      return;
    }

    // 🔹 Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(accessToken, JWT_KEY) as JwtPayload;
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired token, please log in again." });
      return;
    }

    // 🔹 Extract user ID and role
    const userId = decoded.userId;
    const role = decoded.role;

    if (!userId || !role) {
      res.status(403).json({ message: "Invalid token structure." });
      return;
    }

    // 🔹 Determine Schema type
    let Schema: Model<TutorType> | Model<StudentType> | null = null;

    if (role === "Tutor") {
      Schema = Tutor;
    } else if (role === "Student") {
      Schema = Student;
    }

    // 🔹 Ensure Schema is not null before querying
    if (!Schema) {
      res.status(400).json({ message: "Invalid user role." });
      return;
    }

    // ✅ **Explicitly cast Schema to the correct Model type before calling findById**
    const user = await (Schema as Model<TutorType | StudentType>).findById(userId);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // 🔹 Check if user is blocked
    if (user.status === -1) {
      res.status(403).json({ success: false, message: "Your account has been blocked" });
      return;
    }

    // Proceed to next middleware if user is not blocked
    next();
  } catch (error) {
    console.error("Error checking user status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default isBlocked;
