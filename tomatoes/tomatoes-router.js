const router = require("express").Router();
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");
const db = require("../database/dbConfig");
const authenticate = require("../auth/authenticate-middleware");

// const router = require("express").Router();

router.get("/", (req, res) => {
  getIDbyusername(req.headers.authorization).then((id) => {
    db("projects")
      .where({ user_id: id })
      // .join("users", function () {
      //   this.on("users.id", "=", "projects.user_id");
      // })
      .select("project", "tomatoes", "id", "finished")
      .orderBy("projects.id")
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status({ message: "Error retrieving liked songs" });
      });
  });
});
router.put("/project/:id", (req, res) => {
  const { id } = req.params;
  findById(id)
    .then((sub) => {
      if (sub) {
        addingFinished(id).then((finished) => {
          res.status(202).json({ message: "incremented" });
        });
      } else {
        res.status(404).json({ message: "Couldnt find project with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to retrieve" });
    });
});

router.post("/project/:id", (req, res) => {
  const bodyproject = req.body;
  const { id } = req.params;

  findById(id)
    .then((sub) => {
      if (sub) {
        addProject(bodyproject, id).then((topic) => {
          res.status(201).json(bodyproject);
        });
      } else {
        res.status(404).json({ message: "Could not find topic with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create new project" });
    });
});

module.exports = router;

function findById(id) {
  return db("users").where({ id }).first();
}

function addProject(projectBody, id) {
  return db("projects")
    .insert(projectBody, id)
    .then((ids) => {
      return findProjectId(projectBody.user_id);
    });
}

function findProjectId(id) {
  return db("projects");
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
function addingFinished(id) {
  console.log(id);
  return db("projects").where("projects.id", "=", id).increment("finished", 1);
}
//   UPDATE projects
// SET finished = finished + 1
// where projects.id is 8

// knex('accounts')
//   .where('userid', '=', 1)
//   .increment('balance', 10)

function updateSubFinished(id) {
  let incrementFinished =
    "UPDATE projects SET finished += 1 WHERE user_id = id";
}
