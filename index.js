const express = require("express");
const Datastore = require("nedb-promise");
const { getMenu } = require("./routes/beans");

const app = express();
app.use(express.json());

const PORT = 8000;
const URL = "127.0.0.1";

const userRoutes = require("./routes/users");

const db = {};

const dbUsers = new Datastore({
  filename: "./database/users.db",
  autoload: true,
});
const dbOrders = new Datastore({
  filename: "./database/orders.db",
  autoload: true,
});
const dbMenu = new Datastore({
  filename: "./database/menu.db",
  autoload: true,
});

/* app.use("/api/user", userRoutes); */

const server = app.listen(PORT, URL, () => {
  console.log(`Listening to port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello there, my friend!");
});
// Hämtar menyn, separat funktion i nuvarande routes/beans men skall sannolikt flyttas/döpas om
app.get("/beans/menu", async (req, res) => {
  const singleMenuItem = { price, desc, id, title };
  const { price, desc, id, title } = req.body;

  try {
    const menu = await getMenu();
    res.status(200).send("Menu was successfully created");
    res.json(menu);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});
// Ej färdig, för att posta menyn till databasen
app.post("/beans", async (req, res) => {
  const { price, desc, id, title } = req.body;
});

// Skapa ny användare, skall lägga till handering för separat id-bibliotek, möjlighet att rodda "hashning" av lösenord
app.post("/users/signup", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    // id: bibliotek eller db-konsruerat?
  };
  try {
    dbUsers.insert(user);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).send("Could not create a user");
  }
});
// För att hitta användare med specifikt id
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await dbUsers.findOne({ _id: id }, (error, doc) => {
      if (error) {
        res.status(400).send("Person with that id was not found");
      }
      return doc;
    });
    res.json(user);
  } catch (err) {
    res.status(404).send("Could not find user");
  }
});

app.post();

module.exports = { dbUsers, dbOrders };
