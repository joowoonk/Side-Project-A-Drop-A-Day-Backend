const bcrypt = require("bcryptjs");
// const secrets  = require("../../auth/secrets");
exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const users = [
    {
      username: "John",
      password: "123123",
    },
    {
      username: "admin",
      password: "123123123",
    },
    {
      username: "David",
      password: "123123123",
    },
    {
      username: "Luis",
      password: "123123123",
    },
    {
      username: "lambda",
      password: "123123123",
    },
  ];

  return knex("users").insert(users);
};
