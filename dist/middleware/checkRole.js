"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.role) {
            return res.status(401).json({ message: "Unauthorized: No role assigned" });
        }
        if (req.role !== requiredRole) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};
exports.checkRole = checkRole;
