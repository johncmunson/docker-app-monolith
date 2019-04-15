'use strict'
const migrate = require('migrate')
const db = require('./db')

/**
 * Stores and loads the executed migrations in the database. The table
 * migrations is only one row and stores a JSON of the data that the
 * migrate package uses to know which migrations have been executed.
 */
const customStateStorage = {
  load: async function(fn) {
    // Load the single row of migration data from the database
    let rows
    try {
      rows = (await db.query('SELECT data FROM migrations')).rows
    } catch (error) {
      console.log('No migrations found.')
    }

    if (!rows || rows.length !== 1) {
      console.log(
        'Cannot read migrations from database. If this is the first time you run migrations, then this is normal.'
      )
      return fn(null, {})
    }

    // Call callback with new migration data object
    fn(null, rows[0].data)
  },

  save: async function(set, fn) {
    // Check if table 'migrations' exists and if not, create it.
    await db.query(
      'CREATE TABLE IF NOT EXISTS migrations (id integer PRIMARY KEY, data jsonb NOT NULL)'
    )

    await db.query(
      `
      INSERT INTO migrations (id, data)
      VALUES (1, $1)
      ON CONFLICT (id) DO UPDATE SET data = $1
    `,
      [
        {
          lastRun: set.lastRun,
          migrations: set.migrations
        }
      ]
    )

    fn()
  }
}

/**
 * Main application code
 */
migrate.load(
  {
    // Set class as custom stateStore
    stateStore: customStateStorage
  },
  function(err, set) {
    if (err) {
      throw err
    }

    set.up(err2 => {
      if (err2) {
        throw err2
      }

      console.log('Migrations successfully ran')
    })
  }
)
