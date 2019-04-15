// Alternatives and/or compliments to node-postgres include
// pg-promise, massive, squel, knex, sqitch, node-db-migrate,
// node-migrate, flyway, sequelize, typeorm, umzug, slonik, etc
const { Pool } = require('pg')

const connection = {
  host: 'database', // defined in docker-compose.yml
  port: process.env.DATABASE_PORT || 5432, // postgres default value
  database: 'postgres', // postgres default value
  user: 'postgres', // postgres default value
  password: 'postgres', // postgres default value
  max: 10 // max poolsize
}

const pool = new Pool(connection)

module.exports = {
  query: (text, params) => pool.query(text, params)
}
