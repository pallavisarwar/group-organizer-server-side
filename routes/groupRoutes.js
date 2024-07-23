const express = require("express");

const router = express.Router();

const groups = require("../services/groupServices");

router.get("/", (req, res, next) => {
  try {
    res.json(groups.getAll(req));
  } catch (e) {
    console.error("Error while getting groups", e.message);
    next(e);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    res.json(groups.getById(req.params.id));
  } catch (e) {
    console.error("Error while getting group", e.message);
    next(e);
  }
});

module.exports = router;
