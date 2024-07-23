const db = require("./dbServices");

getAll = () => {
  const data = db.query("SELECT * FROM Groups");

  return { data };
};

module.exports = { getAll };
