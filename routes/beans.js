const fs = require("fs").promises;

//Satan i gatan, jag fick den att rendera om en kör nodemon routes/beans!!!

const getMenu = async () => {
  try {
    const menuData = await fs.readFile("menu.json", "utf8");

    const menu = JSON.parse(menuData);

    return menu;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { getMenu };

// Originalet innan tester
/* const getMenu = async () => {
  try {
    const menuData = await fs.readFile("menu.json", "utf8");

    const menu = JSON.parse(menuData);

    return menu;
  } catch (err) {
    console.log(err);
    throw err;
  }
}; 

// Här ligger en gammal skiss på en post till databasen menu.db



*/
