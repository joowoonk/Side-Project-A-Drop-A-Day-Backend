exports.up = function (knex) {
  return knex.schema
    .createTable("users", (users) => {
      users.increments();

      users.string("username", 255).notNullable().unique();
      users.string("password", 255).notNullable();
    })

    .createTable("projects", (users) => {
      users.increments();

      users.string("project", 255).notNullable();
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
  return knex.schema.dropTableIfExists("users");
};
