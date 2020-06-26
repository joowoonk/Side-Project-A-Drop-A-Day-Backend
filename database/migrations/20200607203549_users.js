exports.up = function (knex) {
  return knex.schema
    .createTable("users", (users) => {
      users.increments();

      users.string("username", 255).notNullable().unique();
      users.string("password", 255).notNullable();
    })

    .createTable("projects", (projects) => {
      projects.increments();

      projects.string("project", 255).notNullable();
      projects.integer("tomatoes", 24).notNullable();
      projects.integer("finished", 24).notNullable();
      projects
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
  return knex.schema.dropTableIfExists("projects").dropTableIfExists("users");
};
