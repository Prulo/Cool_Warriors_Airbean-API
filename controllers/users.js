// Här kan det vara rimligt att styra delar av en "signup" som exemeplvis "checken" om användaren finns
// kollar vi på swagger så är det nedre som login, history och status?

const { dbUsers } = require("../index");
const userController = require("../controllers/users");

/* exports.getUsers = function (req, res) {
  const user = dbUsers.findOne({}, (err, users) => {
    if (err) {
      res.status(500).send("User could not be found");
    } else {
      res.status(200).json(users);
    }
  });
};
exports.signup = function (req, res) {};

exports.createUser = function (req, res) {
  const newUser = req.body;

  const user = dbUsers.insert(newUser, (err, user) => {
    if (err) {
      res.status(500).send("User could not be created.");
    } else {
      res.status(201).json(user);
    }
  });
}; */

/* Controllers */
