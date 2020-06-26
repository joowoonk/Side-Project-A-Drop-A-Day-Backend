const router = require("express").Router();
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");
const db = require("../database/dbConfig");
const authenticate = require("../auth/authenticate-middleware");

// const router = require("express").Router();

router.get("/", (req, res) => {
  db("projects")
    .orderBy("projects.id")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status({ message: "Error retrieving projects" });
    });
});
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ user_id: id })
    .select(
      "projects.project",
      "projects.tomatoes",
      "projects.finished",
      "projects.id",
      "users.id as user_id"
    )
    .join("projects", { "projects.user_id": "users.id" })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status({ message: "Error retrieving projects" });
    });
});

router.put("/project/:id", (req, res) => {
  const { id } = req.params;
  findProject(id)
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
router.delete("/project/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  findProject(id)
    .then((sub) => {
      if (sub) {
        console.log("yes?");
        deleteTomatoes(id).then((del) => {
          res.status(205).json({ message: "deleted" });
        });
      } else {
        res
          .status(404)
          .json({ message: "Couldnt find the project with that given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong with server" });
    });
});

router.put("/reset/:id", (req, res) => {
  const { id } = req.params;
  findProjectId({ id })
    .then((sub) => {
      if (sub) {
        resetFinished(id).then((finished) => {
          res.status(202).json({ message: "reset" });
        });
      } else {
        res.status(404).json({ message: "Couldnt find project with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to retrieve" });
    });
});

router.post("/project/", (req, res) => {
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
  const anotherProject = {
    project: projectBody.project,
    tomatoes: projectBody.tomatoes,
    finished: projectBody.finished,
    user_id: id,
  };
  return db("projects")
    .insert(anotherProject, id)
    .then((id) => {
      return findProject(anotherProject.user_id);
    });

  // return db("projects")
  //   .insert(projectBody, id)
  //   .then((ids) => {
  //     //something is wrong here
  //     return findProject(projectBody.user_id);
  //   });
}

function findProject(id) {
  return db("projects");
}
function findProjectId(id) {
  return db("projects").where(id).first();
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

function resetFinished(id) {
  console.log(id);
  return db("projects").where("projects.id", "=", id).update("finished", 0);
}
function deleteTomatoes(id) {
  console.log(id);
  return db("projects").where("projects.id", "=", id).delete();
}
// UPDATE projects
// SET finished = 0
// WHERE projects.id = 3
function updateSubFinished(id) {
  let incrementFinished =
    "UPDATE projects SET finished += 1 WHERE user_id = id";
}
