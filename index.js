const express = require("express");
const Datastore = require("nedb-promise");

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

/* app.use("/api/user", userRoutes); */

const server = app.listen(PORT, URL, () => {
  console.log(`Listening to port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello there, my friend!");
});

// Ej färdig, för att posta menyn till databasen
app.post("/beans", async (req, res) => {
  const { price, desc, id, title } = req.body;
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
    // ser så att det finns en användare som matchar vad man skickar in
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // Hämtar menyn för att sendan titta igenom
    const menuData = await getMenu();
    if (!menuData || !menuData.menu) {
      return res.status(500).json({ error: "Failed to retrieve menu data" });
    }

    const menu = menuData.menu;

    // tittar så att namnet på procukten matchar
    const productInMenu = menu.find((item) => item.title === title);
    if (!productInMenu) {
      return res.status(400).json({ error: "Product not found" });
    }
    // tittar så priset matchar mot procukten
    if (productInMenu.price !== price) {
      return res
        .status(400)
        .json({ error: "Price does not match the product" });

      return res.status(400).json({ error: "Price does not match" });
    }
    // hittar rätt användare
    const userEntry = await dbUsers.findOne({ _id: userId });
    if (!userEntry) {
      return res.status(400).json({ error: "User not found" });
    }
    // sätter upp så det läggs separat i användar arrayen/databasen
    if (!userEntry.products) {
      userEntry.products = [];
    }

    userEntry.products.push({ title, price });

    await dbUsers.update(
      { _id: userId },
      { $set: { products: userEntry.products } }
    );

    console.log("Added product:", { title, price });

    // puschar in produkt i rätt användare
    userEntry.products.push({ title, price });
    // uppdaterar använaren
    await dbUsers.update(
      { _id: userId },
      { $set: { products: userEntry.products } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

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
    res.status(500).send("Internal server error");
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

app.get("/users/products/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await dbUsers.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const products = user.products || [];
    res.json(products);
  } catch (err) {
    console.error("Error occurred while querying database:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
