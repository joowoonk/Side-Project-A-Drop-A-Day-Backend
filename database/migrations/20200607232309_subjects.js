exports.up = function (knex) {
  return knex.schema.createTable("subjects", (users) => {
    users.increments();

    users.string("subject", 255).notNullable().unique();
    users.integer("tomatoes", 24).notNullable();
    users
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("spotifytable")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("subjects");
};
