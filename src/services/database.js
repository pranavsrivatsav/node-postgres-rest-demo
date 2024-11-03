const { Pool } = require("pg");
const env = require("../config")

const pool = new Pool({
  connectionString:
    env.POSTGRES_CONNECTION_STRING,
});

module.exports = {
  pool
}
