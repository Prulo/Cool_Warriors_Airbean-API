// Här kanske vi kan göra en funktion/modul som kollar i databasen om en användare redan finns: try block med users.findOne
// Om användaren finns skicka error
// Om användare inte finns, insert ny användare och skicka statuskod
const fs = require("fs").promises;
const Datastore = require('nedb-promises');

const convertMenuToDB = async () => {
  try {
    // Read menu data from file
    const menuData = await fs.readFile("menu.json", "utf8");
    const menu = JSON.parse(menuData);
    
    // Initialize the NeDB database using your existing file
    const db = Datastore.create({ filename: 'path/to/menu.db', autoload: true });

    // Convert JSON data to NeDB format
    const neDBFormattedMenu = menu.map(item => ({
      // Assuming your menu items have keys like 'name', 'price', etc.
      // Adjust the keys as per your JSON structure
      name: item.name,
      price: item.price,
      // Add more fields as needed
    }));

    // Insert NeDB-formatted menu data into the database
    await db.insert(neDBFormattedMenu);
    console.log("Menu data written to the database successfully.");

  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Call the function to convert and write menu data to the database
convertMenuToDB();