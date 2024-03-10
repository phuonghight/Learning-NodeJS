const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { xss } = require("express-xss-sanitizer");
const path = require("path");
const httpStatus = require("http-status");

const config = require("./config/config");
const morgan = require("./config/morgan.config");
const { errorConverter, errorHandler } = require("./middlewares/error");
const router = require("./routes");
const { messageConstant, constants } = require("./constant");

const app = express();

// morgan
if (config.app.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
// set security HTTP headers
app.use(helmet());

app.use(xss());

app.use(
  "/" + constants.uploadDirectory,
  express.static(path.join(__dirname, "../" + constants.uploadDirectory))
);

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// parse json request body
app.use(express.json());

app.get("/", (req, res) => res.json({ message: messageConstant.helloWorld }));
app.use("/api/v1", router);
app.all("*", (req, res, next) => {
  next({
    status: httpStatus.NOT_FOUND,
    error: messageConstant.notFound(`Api ${req.method} ${req.originalUrl}`),
  });
});

// Errors handler
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
