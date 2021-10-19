// imports
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require("cors");
const { config } = require("./config");

// routes
const { trackRouter, userRouter, playlistRouter } = require("./routes");

// app creation
const app = express();

// app usage of imports
app.use(morgan("dev"));
app.use(helmet());
app.use(json());
app.use(
  cors({
    origin: [
      config.db.url,
      "https://616e732126d84ce7bc2f4787--eloquent-lamarr-cbb596.netlify.app/",
    ],
    methods: ["GET", "PUT", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// app used routes
app.use("/tracks", trackRouter);
app.use("/users", userRouter);
app.use("/playlists", playlistRouter);

// test request to see server works properly
app.get("/", (req, res) => {
  res.status(200).send({
    data: "hello-world",
  });
});

module.exports = app;
