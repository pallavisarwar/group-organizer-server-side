const express = require("express");

const app = express();

const port = 3000 || process.env.port;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.listen(port, () => {
  console.log(`Group Organizer API Listening at http://localhost:${port}`);
});
