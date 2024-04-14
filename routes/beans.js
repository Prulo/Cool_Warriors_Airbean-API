const fs = require("fs").promises;

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

module.exports = getMenu;
