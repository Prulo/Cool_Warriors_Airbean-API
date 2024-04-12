const express = require("express");
const Datastore = require("nedb-promise");

const app = express();
app.use(express.json());

const PORT = 8000;
const URL = "127.0.0.1";

const db = {};

const dbUsers = new Datastore({
  filename: "./database/users.db",
  autoload: true,
});
const dbOrders = new Datastore({
  filename: "./database/orders.db",
  autoload: true,
});

const server = app.listen(PORT, URL, () => {
  console.log(`Listening to port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello there, my friend!");
});
