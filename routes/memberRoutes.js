const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const db = require("../services/dbServices");

router.get("/", (req, res, next) => {
  try {
    db.all("SELECT * FROM Members", (err, rows) => {
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
    console.error("Error while getting members", e.message);
    next(e);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    db.get(
      `SELECT * FROM Members WHERE MemberId = ${req.params.id}`,
      (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        if (!row) {
          res.status(404).json({
            message: "Member not found",
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
    console.error("Error while getting member", e.message);
    next(e);
  }
});

router.post("/", (req, res, next) => {
  if (!req.body.nickName || req.body.nickName === "") {
    res.status(400).json({ error: "New member nickName must be provided" });
    return;
  }
  const data = {
    MemberId: 0,
    NickName: req.body.nickName,
    Bio: req.body.bio,
    AvatarURL: req.body.avatarUrl,
    Age: req.body.age,
  };
  const sql = `INSERT INTO Members 
  (NickName, Bio, AvatarURL, Age) 
  VALUES ("${data.NickName}","${data.Bio}","${data.AvatarURL}",${data.Age})`;
  try {
    db.run(sql, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      data.GroupId = this.lastID;
      res.status(201).json({
        message: "Member created",
        data,
      });
    });
  } catch (e) {
    console.error("Error while creating member", e.message);
    next(e);
  }
});

router.put("/:id", (req, res, next) => {
  if (!req.params.id || req.params.id <= 0) {
    res.status(404).json({ error: "Member not found" });
    return;
  }

  if (!req.body.nickName || req.body.nickName === "") {
    res.status(400).json({ error: "New member nickName cannot be blank" });
    return;
  }

  const data = {
    MemberId: req.params.id,
    NickName: req.body.nickName,
    Bio: req.body.bio,
    AvatarURL: req.body.avatarUrl,
    Age: req.body.age,
    GroupId: req.body.groupId,
  };
  const sql = `UPDATE Members SET
  NickName = COALESCE("${data.NickName}", NickName),
  Bio = COALESCE("${data.Bio}", Bio),
  AvatarURL = COALESCE("${data.AvatarURL}", AvatarURL),
  Age = COALESCE(${data.Age}, Age),
  GroupId = COALESCE(${data.GroupId}, GroupId)
  WHERE MemberId = ${req.params.id};`;
  try {
    db.run(sql, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({
        message: "Member updated",
        data,
        changes: this.changes,
      });
    });
  } catch (e) {
    console.error("Error while updating member", e.message);
    next(e);
  }
});

router.delete("/:id", (req, res, next) => {
  if (!req.params.id || req.params.id <= 0) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  try {
    db.run(
      `DELETE FROM Members WHERE MemberId = ${req.params.id}`,
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.status(200).json({
          message: "Member deleted",
          changes: this.changes,
        });
      }
    );
  } catch (e) {
    console.error("Error while deleting member", e.message);
    next(e);
  }
});

module.exports = router;
