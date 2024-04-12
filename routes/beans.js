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
(async () => {
  try {
    const menu = await getMenu();
    console.log("Meny inläst:", menu);
  } catch (error) {
    console.error("Det gick inte att hämta menyn:", error);
  }
})();
