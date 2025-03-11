import morgan from "morgan";
import logger from "./logger";

// Define the timestamp token
morgan.token("timestamp", () => new Date().toISOString());

// Updated format including the timestamp token
const morganFormat = ":timestamp :method :url :status - :response-time ms";

// Function to colorize HTTP status codes
const colorizeStatus = (status: number): string => {
  if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // Red
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // Yellow
  return `\x1b[32m${status}\x1b[0m`; // Green
};

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());

      // Match components in the log message
      const match = message.match(/(\S+)\s+(\S+)\s+(\S+)\s+(\d{3})\s+-\s+([\d.]+)\s+ms/);
      if (match) {
        const [, timestamp, method, url, status, responseTime] = match;
        const colorizedStatus = colorizeStatus(parseInt(status));
        const colorizedMessage = message.replace(status, colorizedStatus);

        // Log the request details in color
        // console.log(colorizedMessage.trim());
      }
    },
  },
});

export default morganMiddleware;
