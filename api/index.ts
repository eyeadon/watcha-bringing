import winston from "winston";
import app from "../index.js";

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default app;
