const bcrypt = require("bcryptjs");
exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const tomatoes = [
    {
      subject: "Practice Reading English",
      tomatoes: 6,
      user_id: 1,
      finished: 0,
    },
    {
      subject: "Solve Leetcode problems",
      tomatoes: 8,
      user_id: 1,
      finished: 0,
    },
    {
      subject: "Working on side project",
      tomatoes: 8,
      user_id: 1,
      finished: 0,
    },
  ];

  return knex("subjects").insert(tomatoes);
};
