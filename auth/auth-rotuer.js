const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require("express").Router();
const secrets = require("../auth/secrets");

const Users = require("./auth-model");
const { isValid } = require("./auth-service");

router.get("/", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json({ users, jwt: req.jwt });
    })
    .catch((err) => res.send(err));
});

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

router.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ "u.username": username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = generateToken(user);
          // id:user.id on 55 makes sure front-end to have user.id
          res
            .status(200)
            .json({ message: `Welcome ${user.username}`, id: user.id, token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the passwrod should be alphanuemric",
    });
  }
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

module.exports = router;
