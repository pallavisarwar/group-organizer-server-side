const express = require("express");
const app = express();

const port = 3000 || process.env.port;
const cors = require("cors");

const groupsRouter = require("./routes/groupRoutes");
const membersRouter = require("./routes/memberRoutes");

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  // res.setHeader("Content-Type: application/json");
  // res.setHeader("Access-Control-Allow-Origin: *");
  // res.setHeader("Access-Control-Allow-Methods: GET,PUT,POST,DELETE");
  res.json({ message: "ok" });
});

app.use("/groups", groupsRouter);
app.use("/members", membersRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(
    err.message ?? "An unexpected error occurred.",
    err.stack ?? []
  );
  res.status(statusCode).json({ message: err.message });
  return;
});

app.use(cors());

app.listen(port, () => {
  console.log(`Group Organizer API Listening at http://localhost:${port}`);
});
