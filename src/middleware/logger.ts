import path from "path";
import fs from "fs";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const logDir = path.join(__dirname, "../../logs");

// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Timestamp format
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  );
  
  // Daily Rotate File Transport (Automatically deletes old logs)
  const dailyRotateTransport = new transports.DailyRotateFile({
    filename: path.join(logDir, "app-%DATE%.log"), 
    datePattern: "YYYY-MM-DD", 
    maxSize: "10m", 
    maxFiles: "7d", 
    zippedArchive: true, 
  });


// Define the Winston logger
const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    dailyRotateTransport,
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      ),
    }),
  ],
});

export default logger;
