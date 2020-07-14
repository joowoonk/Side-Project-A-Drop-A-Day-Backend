const router = require("express").Router();
const jwt = require("jsonwebtoken");
const secrets = require("../auth/secrets");
const db = require("../database/dbConfig");
const authenticate = require("../auth/authenticate-middleware");
var cron = require("node-cron");

// const router = require("express").Router();

//fetching all the projects
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

//fetch project by id with user_id
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
    .orderBy("projects.id")
    .join("projects", { "projects.user_id": "users.id" })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status({ message: "Error retrieving projects" });
    });
});

// adding tomato once finished, using UPDATE endpoint
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

//deleting a project
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

//reseting project by project_id
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

//adding project
router.post("/project/", (req, res) => {
  const bodyproject = req.body;
  // const { id } = req.params;

  findById(bodyproject.user_id)
    .then((sub) => {
      if (sub) {
        addProject(bodyproject, sub.id).then((topic) => {
          res.status(201).json(bodyproject);
        });
      } else {
        res
          .status(404)
          .json({ message: "Could not find project with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create new project" });
    });
});

//reseting all the projects
const reset = () => {
  db("projects")
    .update("finished", 0)
    .then((reset) => {
      console.log("ALL THE FINISHED COUNTS ARE RESET!");
    })
    .catch((err) => {
      // res.status(500).json({ message: "failed to rest every project" });
    });
};

//every midnight
cron.schedule("0 0 * * *", () => {
  // const reset = () => {
  //   db("projects")
  //     .update("finished", 0)
  //     .then((reset) => {
  //       console.log("ALL THE FINISHED COUNTS ARE RESET!");
  //     })
  //     .catch((err) => {
  //       // res.status(500).json({ message: "failed to rest every project" });
  //     });
  // };
  reset();
});

// cron.schedule("* * * * *", () => {
//   reset();
// });

//UPDATE projects SET finished = 0;

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
  return db("projects")
    .where("projects.id", "=", id)
    .update("finished", 0)
    .orderBy("projects.id");
}
function deleteTomatoes(id) {
  console.log(id);
  return db("projects")
    .where("projects.id", "=", id)
    .delete()
    .orderBy("projects.id");
}
// UPDATE projects
// SET finished = 0
// WHERE projects.id = 3
function updateSubFinished(id) {
  let incrementFinished =
    "UPDATE projects SET finished += 1 WHERE user_id = id";
}
