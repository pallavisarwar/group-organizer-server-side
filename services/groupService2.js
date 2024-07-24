const db = require("./dbServices2");

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

create = (groupToAdd = null) => {
  const result = db.query(
    `INSERT INTO Groups
    (Title, Description, ImageURL)
    VALUES
    (${groupToAdd.title}, ${groupToAdd.description}, ${groupToAdd.imageUrl})`
  );
};

module.exports = {
  getAll,
  getById,
};
