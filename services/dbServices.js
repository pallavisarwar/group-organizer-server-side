const sqlite = require("better-sqlite3");

const path = require("path");
// const { param } = require("../routes/groupRoutes");
// const { query } = require("express");

const db = new sqlite(path.resolve("database", "groupOrganizerDB.sqlite3"), {
  fileMustExist: true,
});

query = (sql, params = []) => {
  return db.prepare(sql).all(params);
};

module.exports = { query };
