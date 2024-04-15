const express = require("express");
const Datastore = require("nedb-promise");
const { v4: uuidv4 } = require("uuid");

const { getMenu } = require("./routes/beans");

const fs = require("fs").promises;

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
const dbMenu = new Datastore({
  filename: "./database/menu.db",
  autoload: true,
});

const server = app.listen(PORT, URL, () => {
  console.log(`Listening to port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello there, my friend!");
});

module.exports = { dbUsers, dbOrders };

app.get("/beans", async (req, res) => {
  try {
    const menu = await getMenu();
    res.json(menu);
  } catch (error) {
    console.error("Failed", error);
    res.status(500).json({ error: "Failed" });
  }
});

app.post("/add", async (req, res) => {
  try {
    const { title, price } = req.body;

    const menuData = await getMenu();
    const menu = menuData.menu;

    const productInMenu = menu.find((item) => item.title === title);

    if (!productInMenu) {
      return res.status(400).json({ error: "Product not found in the menu" });
    }

    if (productInMenu.price !== price) {
      return res
        .status(400)
        .json({ error: "Price does not match the product" });
    }

    // lägg till produkt i databas

    console.log("Added product:", { title, price });

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Get requst for login returnera UUID?
// Get request för orderhistorik (som gäst eller som användare (uuid))

// När vi skapar, rodda id, uuid,
app.post("/users/signup", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !email) {
    return res.status(400).send("Username and/or password are required");
  }
  try {
    const existingUser = await dbUsers.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const newUser = {
      username,
      password,
      email,
      userId: uuidv4(),
    };

    await dbUsers.insert(newUser);
    res.status(201).json({ message: "User created", userId: newUser.userId });
    console.log(newUser);
    // Den kan dessvärre lägga till användare med tomma fält, lägg in ex "user.length > 0"
  } catch (err) {
    res.status(400).send("Could not create a user");
  }
});

app.get("/users/login");

// För att hitta användare med specifikt id, anvämnda för att returnera ordrar lagda med ID:t?
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
