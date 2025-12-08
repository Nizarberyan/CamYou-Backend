import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const logFormat = printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { timestamp, level, message, stack } = info as any;
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: "http",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json(),
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
      ),
    }),
  );
}

export default logger;
