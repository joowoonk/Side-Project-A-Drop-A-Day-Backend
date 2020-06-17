const bcrypt = require("bcryptjs");
exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const tomatoes = [
    {
      project: "Practice Reading English",
      tomatoes: 6,
      user_id: 1,
      finished: 0,
    },
    {
      project: "Solve Leetcode problems",
      tomatoes: 8,
      user_id: 1,
      finished: 0,
    },
    {
      project: "Working on side project",
      tomatoes: 8,
      user_id: 1,
      finished: 0,
    },
  ];

  return knex("projects").insert(tomatoes);
};
