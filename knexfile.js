require("dotenv").config();

// const pgConnection =
//   process.env.DATABASE_URL || "postgresql://postgres@localhost/auth";

// module.exports = {
//   development: {
//     client: "sqlite3",
//     useNullAsDefault: true,
//     connection: {
//       filename: "./database/auth.db3",
//     },
//     pool: {
//       afterCreate: (conn, done) => {
//         conn.run("PRAGMA foreign_skeys = ON", done);
//       },
//     },
//     migrations: {
//       directory: "./database/migrations",
//     },
//     seeds: {
//       directory: "./database/seeds",
//     },
//   },
//   testing: {
//     client: "sqlite3",
//     connection: {
//       filename: "./database/test.db3",
//     },
//     useNullAsDefault: true,
//     migrations: {
//       directory: "./database/migrations",
//     },
//     seeds: {
//       directory: "./database/seeds",
//     },
//   },
// }; + "&ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory"

const pgConnection =
  process.env.DATABASE_URL || "postgresql://postgres@localhost/auth";
// {
// database: 'nodelogin', //postgres by default
// user: 'postgres', //postgres by default
// password: 'hinata5185', //blank by default
// }

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database/auth.db3",
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      },
    },
    migrations: {
      directory: "./database/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
  },
  testing: {
    client: "sqlite3",
    connection: {
      filename: "./database/test.db3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./database/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
  },
  production: {
    client: "pg",
    connection: {connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },},
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./database/migrations",
    },

    seeds: {
      directory: "./database/seeds",
    },
  },
};
