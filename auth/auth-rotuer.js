const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require("express").Router();
const secrets = require("../auth/secrets");
const db = require("../database/dbConfig");
const Users = require("./auth-model");
const { isValid } = require("./auth-service");

//fetch all user infos
router.get("/user", (req, res) => {
  // const { id } = req.params;
  db("users")
    .select("*")
    .orderBy("users.id")
    .then((user) => {
      console.log("yes");
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      console.log("no");
      res.status(500).json({ message: "Error retrieving user" });
    });
});

//fetch user info by id
router.get("/:id/user", (req, res) => {
  const { id } = req.params;
  db("users")
    .select("username", "id")
    .where({ id })
    .orderBy("users.id")
    .then((user) => {
      console.log("yes");
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      console.log("no");
      res.status(500).json({ message: "Error retrieving user" });
    });
});

//sign up endpoint
router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    Users.add(credentials)
      .then((user) => {
        // const something = () => {};
        res.status(201).json({ user });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

//login endpoint
router.post("/login", userValidation, (req, res) => {
  const { username, password } = req.body;
  db("users")
    .select("*")
    .where({ username })
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(201).json({ msg: "Authorized", token, id: user.id });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});

function generateToken(user) {
  const payload = {
    username: user.username,
  };
  const options = {
    expiresIn: "30d",
  };
  return jwt.sign(payload, secrets.secret, options);
}

function getIDbyusername(token) {
  const { username } = jwt.verify(token, secrets.secret);
  return db("Users").select("id").first();
  // .then(({ id }) => {
  //   return id;
  // });
}

module.exports = router;

function userValidation(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.status(403).send({
      message: "Please make sure to provide both username and password",
    });
  }
  next();
}
