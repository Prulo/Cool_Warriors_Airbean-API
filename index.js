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
    const { title, price, userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Retrieve menu data
    const menuData = await getMenu();
    if (!menuData || !menuData.menu) {
      return res.status(500).json({ error: "Failed to retrieve menu data" });
    }

    const menu = menuData.menu;

    // Find the product in the menu
    const productInMenu = menu.find((item) => item.title === title);

    if (!productInMenu) {
      return res.status(400).json({ error: "Product not found in the menu" });
    }

    if (productInMenu.price !== price) {
      return res.status(400).json({ error: "Price does not match the product" });
    }

    // Now you can add the product to the user's entry in the database
    const userEntry = await dbUsers.findOne({ _id: userId });

    if (!userEntry) {
      return res.status(400).json({ error: "User not found" });
    }

    // Initialize products array if it doesn't exist
    if (!userEntry.products) {
      userEntry.products = [];
    }
 
    userEntry.products.push({ title, price });

    
    await dbUsers.update({ _id: userId }, { $set: { products: userEntry.products } });

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
  const user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    // userId
    // id: bibliotek eller db-konsruerat?
  };
  try {
    dbUsers.insert(user);
    res.status(201).json({ message: "User created" });
    // Den kan dessvärre lägga till användare med tomma fält, lägg in ex "user.length > 0"
  } catch (err) {
    res.status(400).send("Could not create a user");
  }
});
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


