'use strict'

const db = require('../db.js')

module.exports.up = async () => {
  try {
    await db.query(/* alter schema or seed some data */)
  } catch (err) {
    console.error('Failed migration', err.stack)
  }
}

module.exports.down = async () => {
  try {
    await db.query(/* reverse the above operation */)
  } catch (err) {
    console.error('Failed migration', err.stack)
  }
}
