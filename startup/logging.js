import "winston-mongodb";
import pkg from "winston";
const { add, exceptions, format, rejections, transports } = pkg;
const { colorize, combine, json, prettyPrint, simple, timestamp } = format;

export default function logging(connectionString) {
  exceptions.handle(
    new transports.Console({
      format: combine(colorize(), prettyPrint()),
    }),
    new transports.File({
      filename: "uncaughtExceptions.log",
    })
  );

  rejections.handle(new transports.File({ filename: "rejections.log" }));

  add(
    new transports.File({
      filename: "logfile.log",
      level: "info",
      format: combine(timestamp(), json()),
    })
  );

  add(
    new transports.Console({
      level: "info",
      format: combine(colorize(), simple()),
    })
  );

  add(
    new transports.MongoDB({
      db: connectionString,
      level: "info",
      collection: "log",
    })
  );
}
