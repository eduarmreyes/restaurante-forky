/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://kjtejmox:fR91SkV7qagzYAqPIXVIFCcRsd55jBZH@stampy.db.elephantsql.com/kjtejmox",
  DATABASE_URL_DEVELOPMENT = "postgres://vetjajbf:GJqCq4GeFXrgwl_dRk6xVpZwSsv-4YMB@stampy.db.elephantsql.com/vetjajbf",
  DATABASE_URL_TEST = "postgres://vetjajbf:GJqCq4GeFXrgwl_dRk6xVpZwSsv-4YMB@stampy.db.elephantsql.com/vetjajbf",
  DATABASE_URL_PREVIEW = "=postgres://vetjajbf:GJqCq4GeFXrgwl_dRk6xVpZwSsv-4YMB@stampy.db.elephantsql.com/vetjajbf",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
