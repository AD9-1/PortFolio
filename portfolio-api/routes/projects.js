const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    console.log("under storage", file);
    const fileExt = path.extname(file.originalname);
    const filename =
      file.originalname.replace(fileExt, "").split(" ").join("-") + fileExt;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    )
      cb(null, true);
    else {
      cb(new Error("Only jpeg,png or jpg extension is allowed")); //this is not multer.MulterError
    }
  },
});


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const stringProjects = fs.readFileSync("./data/projects.json", "utf-8");
    const jsonProjects = JSON.parse(stringProjects);

    if (!req.file) {
      res.status(500).json("The Project Image is required");
    } else {
      const length = jsonProjects.length;

      const newProject = {
        id: length,
        name: req.body.name,
        image: req.file.filename,
        skills: req.body.skills,
        githublink: req.body.githublink,
      };
      console.log(newProject);
      jsonProjects.push(newProject);
      fs.writeFileSync("./data/projects.json", JSON.stringify(jsonProjects));
      res.json(jsonProjects);
    }
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: error });
  }
});

router.get("/", async (req, res) => {
  const stringProjects = fs.readFileSync("./data/projects.json", "utf-8");
  const jsonProjects = JSON.parse(stringProjects);
  res.send(jsonProjects);
});

router.get("/projects/:projectId", async (req, res) => {
  try {
    const stringProjects = fs.readFileSync("./data/projects.json", "utf-8");
    const jsonProjects = JSON.parse(stringProjects);

    const projectId = parseInt(req.params.projectId);

    const singleProject = jsonProjects.find(
      (project) => project.id === projectId
    );

    if (singleProject) res.status(200).json(singleProject);
    else
      res
        .status(404)
        .json({ message: `no project found with ${req.params.projectId}` });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
