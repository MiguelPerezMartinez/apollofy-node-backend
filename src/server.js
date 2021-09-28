// imports
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require("cors");

// routes
const {
  // productRouter,
  // modelRouter,
  userRouter,
  // personRouter,
  // movieRouter,
  // movieGenreRouter,
} = require("./routes");

// app creation
const app = express();

// app usage of imports
app.use(morgan("dev"));
app.use(helmet());
app.use(json());
app.use(cors());

// app used routes
// app.use("/products", productRouter);
app.use("/users", userRouter);
// app.use("/models", modelRouter);

// test request to see server works properly
app.get("/", (req, res) => {
  res.status(200).send({
    data: "hello-world",
  });
});

module.exports = app;
