"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const logDir = path_1.default.join(__dirname, "../../logs");
// Ensure the logs directory exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const logFormat = winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Timestamp format
winston_1.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`));
// Daily Rotate File Transport (Automatically deletes old logs)
const dailyRotateTransport = new winston_1.transports.DailyRotateFile({
    filename: path_1.default.join(logDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "10m",
    maxFiles: "7d",
    zippedArchive: true,
});
// Define the Winston logger
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: logFormat,
    transports: [
        dailyRotateTransport,
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), logFormat),
        }),
    ],
});
exports.default = logger;
