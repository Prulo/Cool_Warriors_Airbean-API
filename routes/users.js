// Här kanske vi kan göra en funktion/modul som kollar i databasen om en användare redan finns: try block med users.findOne
// Om användaren finns skicka error
// Om användare inte finns, insert ny användare och skicka statuskod

/* const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.post("/user/signup", userController.getUsers);

router.post("/user/login", userController.createUser);
router;

module.exports = router; */

/* Routes */

// Skapa ny användare, skall lägga till handering för separat id-bibliotek, möjlighet att rodda "hashning" av lösenord
