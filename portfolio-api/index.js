require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const projectsFamily = require("./routes/projects");
const port = process.env.PORT;
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(express.json());
app.use("/", projectsFamily);
app.use(express.static("./images"));

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError)
      res.status(500).send("There is an upload error");
    else res.status(500).send(err.message);
  } else {
    res.send(success);
  }
});


app.use("*", async (req, res) => {
  res.json("No Path Found");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
