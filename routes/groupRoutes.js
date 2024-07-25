const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const db = require("../services/dbServices");

router.get("/", (req, res, next) => {
  try {
    db.all("SELECT * FROM Groups", (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({
        message: "success",
        data: rows,
      });
    });
  } catch (e) {
    console.error("Error while getting groups", e.message);
    next(e);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    db.get(
      `SELECT * FROM Groups WHERE GroupId = ${req.params.id}`,
      (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        if (!row) {
          res.status(404).json({
            message: "Group not found",
          });
          return;
        }
        res.status(200).json({
          message: "success",
          data: row,
        });
      }
    );
  } catch (e) {
    console.error("Error while getting group", e.message);
    next(e);
  }
});

router.get("/:id/members", (req, res, next) => {
  try {
    db.get(
      `SELECT * FROM Members WHERE GroupId = ${req.params.id}`,
      (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        if (!row) {
          res.status(404).json({
            message: "Members not found for provided group",
          });
          return;
        }
        res.status(200).json({
          message: "success",
          data: row,
        });
      }
    );
  } catch (e) {
    console.error("Error while getting group members", e.message);
    next(e);
  }
});

router.post("/", (req, res, next) => {
  if (!req.body.title || req.body.title === "") {
    res.status(400).json({ error: "New group title must be provided" });
    return;
  }
  const data = {
    GroupId: 0,
    Title: req.body.title,
    Description: req.body.description,
    ImageURL: req.body.imageUrl,
  };
  const sql = `INSERT INTO Groups 
  (Title, Description, ImageURL) 
  VALUES ("${data.Title}","${data.Description}","${data.ImageURL}")`;
  console.log("sql", sql);
  try {
    db.run(sql, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      data.GroupId = this.lastID;
      res.status(201).json({
        message: "Group created",
        data,
      });
    });
  } catch (e) {
    console.error("Error while creating group", e.message);
    next(e);
  }
});

router.put("/:id", (req, res, next) => {
  if (!req.params.id || req.params.id <= 0) {
    res.status(404).json({ error: "Group not found" });
    return;
  }

  if (!req.body.title || req.body.title === "") {
    res.status(400).json({ error: "New group title cannot be blank" });
    return;
  }

  const data = {
    GroupId: req.params.id,
    Title: req.body.title,
    Description: req.body.description,
    ImageURL: req.body.imageUrl,
  };
  const sql = `UPDATE Groups SET
  Title = COALESCE("${data.Title}", Title),
  Description = COALESCE("${data.Description}", Description),
  ImageURL = COALESCE("${data.ImageURL}", ImageURL)
  WHERE GroupId = ${req.params.id}`;
  try {
    db.run(sql, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({
        message: "Group updated",
        data,
        changes: this.changes,
      });
    });
  } catch (e) {
    console.error("Error while updating group", e.message);
    next(e);
  }
});

router.delete("/:id", (req, res, next) => {
  if (!req.params.id || req.params.id <= 0) {
    res.status(404).json({ error: "Group not found" });
    return;
  }
  try {
    db.run(
      `DELETE FROM Groups WHERE GroupId = ${req.params.id}`,
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.status(200).json({
          message: "Group deleted",
          changes: this.changes,
        });
      }
    );
  } catch (e) {
    console.error("Error while deleting group", e.message);
    next(e);
  }
});

module.exports = router;
