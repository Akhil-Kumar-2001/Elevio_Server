import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const authenticationMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const JWT_KEY = process.env.JWT_SECRET as string;
      const accessToken = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

      if (!accessToken) {
        res.status(401).json({ message: "Access token not found, please log in" });
        return;
      }

      jwt.verify(accessToken, JWT_KEY, async (err: unknown, data: JwtPayload | string | undefined) => {
        if (err) {
          console.log("Token error:", accessToken, err);
          return res.status(403).json({ message: "Invalid or expired token, please log in again." });
        }

        if (!data) {
          return res.status(403).json({ message: "Invalid token structure." });
        }

        const { role, userId } = data as { role: string, userId: string }

        // Optional logging (still keeping role if needed elsewhere)
        console.log("Token validated. User ID:", userId, "Role:", role);

        req.userId = userId;
        req.role = role;
        next();
      });

    } catch (error) {
      console.log("Middleware error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

export default authenticationMiddleware
