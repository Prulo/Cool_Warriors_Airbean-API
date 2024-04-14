const fs = require("fs").promises;

//Satan i gatan, jag fick den att rendera om en kör nodemon routes/beans!!!

const getMenu = async () => {
  try {
    const menuData = await fs.readFile("menu.json", "utf8");

    const menu = JSON.parse(menuData);
    console.log(menuData);
    return menu;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

getMenu();

module.exports = { getMenu };


module.exports = getMenu;

