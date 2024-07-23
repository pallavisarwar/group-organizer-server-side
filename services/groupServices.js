const db = require("./dbServices");

getAll = () => {
  const data = db.query("SELECT * FROM Groups");

  return { data };
};

getById = (id = 0) => {
  if (id === 0) {
    return [];
  }
  const data = db.query(`SELECT * FROM Groups WHERE GroupId =${id}`);

  return { data };
};

module.exports = { getAll, getById };
