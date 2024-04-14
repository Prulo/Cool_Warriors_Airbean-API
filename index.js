const express = require("express");
const Datastore = require("nedb-promise");
const fs = require("fs").promises;
const getMenu = require("./routes/beans");
const menu = require("./menu.json");

console.log(menu);

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

app.get("/menu", async (req, res) => {
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

    const productInMenu = menu.find(item => item.title === title);

    if (!productInMenu) {
      return res.status(400).json({ error: "Product not found in the menu" });
    }

    if (productInMenu.price !== price) {
      return res.status(400).json({ error: "Price does not match the product" });
    }

    // lägg till produkt i databas

    console.log("Added product:", { title, price });

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});