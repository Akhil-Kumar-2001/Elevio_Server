import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    role?: string;
    email?: string;
  }
}

export const validateToken = (requiredRole?: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const JWT_KEY = process.env.JWT_SECRET as string;
      let accessToken = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

      if (!accessToken) {
        res.status(401).json({ message: "Access token not found, please log in" });
        return;
      }

      jwt.verify(accessToken, JWT_KEY, async (err: unknown, data: JwtPayload | string | undefined) => {
        if (err) {
          console.log("acc", accessToken, err)
          return res.status(403).json({ message: "Invalid or expired token, please log in again." });
        }

        if (!data) {
          return res.status(403).json({ message: "Invalid token structure." });
        }

        const { role, userId } = data as { role: string, userId: string }


        // Check role
        if (requiredRole && role !== requiredRole) {
          return res.status(403).json({ message: "Access denied: Insufficient permissions." });
        }

        console.log("Checking role of the user in middleware => ", role);

        req.userId = userId;
        req.role = role;
        next();
      });

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
};
