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
  return knex.schema.dropTableIfExists("projects").dropTableIfExists("users");
};

// exports.up = function (knex) {
//   return knex.schema
//     .createTable('users', (users) => {
//       users.increments()

//       users.varchar('username', 255).notNullable().unique()
//       users.varchar('password', 255).notNullable()
//     })
//     .createTable('todos', (todos) => {
//       todos.increments()

//       todos.varchar('title', 255).notNullable()
//       todos.varchar('description', 255)
//       todos.boolean('important').defaultTo(false)
//       todos.boolean('completed').defaultTo(false)
//       todos.datetime('date_time')
//       todos.string('repeat')
//       todos.boolean('isDeleted').defaultTo(false)

//       todos
//         .integer('user_id')
//         .unsigned()
//         .notNullable()
//         .references('id')
//         .inTable('users')
//         .onUpdate('CASCADE')
//         .onDelete('RESTRICT')
//     })
// }

// exports.down = function (knex, Promise) {
//   return knex.schema.dropTableIfExists('todos').dropTableIfExists('users')
// }
