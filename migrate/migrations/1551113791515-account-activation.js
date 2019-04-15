'use strict'

const db = require('../db.js')

module.exports.up = async () => {
  try {
    await db.query(`
      ALTER TABLE account
      ADD COLUMN IF NOT EXISTS activation_code uuid NOT NULL,
      ADD COLUMN IF NOT EXISTS activated boolean NOT NULL DEFAULT FALSE
    `)
  } catch (err) {
    console.error('Failed migration', err.stack)
  }
}

module.exports.down = async () => {
  try {
    await db.query(`
      ALTER TABLE account
      DROP COLUMN IF EXISTS activation_code,
      DROP COLUMN IF EXISTS activated
    `)
  } catch (err) {
    console.error('Failed migration', err.stack)
  }
}
