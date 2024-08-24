// const express = require("express");
// const app = express();

// const mongoose = require("mongoose");
// const dishes = require("./routes/dishes");
// const bevs = require("./routes/bevs");

// // returns promise
// mongoose
//   .connect("mongodb://localhost/watcha-bringing")
//   .then(() => console.log("Connected to MongoDB..."))
//   .catch((err) => console.error("Could not connect to MongoDB", err));

// app.use(express.json());
// app.use("/api/dishes", dishes);
// app.use("/api/bevs", bevs);

// // require("./startup/prod")(app);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dishes from "./routes/dishes.js";
import bevs from "./routes/bevs.js";

const app = express();

// returns promise
mongoose
  .connect("mongodb://localhost/watcha-bringing")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(cors());
app.use(express.json());
app.use("/api/dishes", dishes);
app.use("/api/bevs", bevs);

// require("./startup/prod")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
