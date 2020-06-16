exports.up = function (knex) {
  return knex.schema.createTable("subjects", (users) => {
    users.increments();

    users.string("subject", 255).notNullable();
    users.integer("tomatoes", 24).notNullable();
    users.integer("finished", 24).notNullable();
    users
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("subjects");
};
