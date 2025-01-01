import express from "express";
const app = express();
import cors from "cors";
import winston from "winston";
import mongoose from "mongoose";
import "express-async-errors";
import dishes from "./routes/dishes.js";
import bevs from "./routes/bevs.js";
import events from "./routes/events.js";
import error from "./middleware/error.js";
import logging from "./startup/logging.js";

const db = process.env.MONGODB_URI + process.env.DB_NAME;

logging(db);

mongoose.connect(db).then(() => winston.info("Connected to MongoDB..."));

app.use(cors());
app.use(express.json());
app.use("/", express.static("dist"));
app.use("/api/dishes", dishes);
app.use("/api/bevs", bevs);
app.use("/api/events", events);
app.use(error);

// require("./startup/prod")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
