const router = require("express").Router();
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");
const db = require("../database/dbConfig");
const authenticate = require("../auth/authenticate-middleware");

// const router = require("express").Router();

router.get("/", (req, res) => {
  getIDbyusername(req.headers.authorization).then((id) => {
    db("subjects")
      .where({ user_id: id })
      // .join("users", function () {
      //   this.on("users.id", "=", "subjects.user_id");
      // })
      .select("subject", "tomatoes", "id", "finished")
      .orderBy("subjects.id")
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status({ message: "Error retrieving liked songs" });
      });
  });
});

router.post("/:id/subject", (req, res) => {
  const bodySubject = req.body;
  const { id } = req.params;

  findById(id)
    .then((sub) => {
      if (sub) {
        addSubject(bodySubject, id).then((topic) => {
          res.status(201).json(bodySubject);
        });
      } else {
        res.status(404).json({ message: "Could not find topic with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create new subject" });
    });
});

module.exports = router;

function findById(id) {
  return db("users").where({ id }).first();
}

function addSubject(subjectBody, id) {
  return db("subjects")
    .insert(subjectBody, id)
    .then((ids) => {
      return findSubjectId(subjectBody.user_id);
    });
}

function findSubjectId(id) {
  return db("subjects");
}

function getIDbyusername(token) {
  const { username } = jwt.verify(token, secrets.secret);
  return db("Users")
    .select("id")
    .where({ username: username })
    .first()
    .then(({ id }) => {
      return id;
    });
}

function getIDbyusername(token) {
  const { username } = jwt.verify(token, secrets.secret);
  return db("Users")
    .select("id")
    .where({ username: username })
    .first()
    .then(({ id }) => {
      return id;
    });
}
