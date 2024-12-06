// logging messages to console
import winston from "winston";

// express error-handling middleware function
// this function catches errors in the request processing pipeline
export default function error(err, req, res, next) {
  // (message, metadata)
  winston.error(err.message, err);

  // 500 internal server error
  res.status(500).send("Internal server error.");
}
