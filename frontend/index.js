const path = require('path')
const express = require('express')

const port = process.env.FRONTEND_PORT || 3000
// const env = process.env.NODE_ENV || 'development'

const app = express()

app.use(express.static(path.join(__dirname, 'build')))
app.use('/', express.static(path.join(__dirname, 'build')))
app.use('/*', express.static(path.join(__dirname, 'build')))

app.use((req, res, next) => {
  return res.status(404).json({ error: 'Route not found' })
})

app.listen(port, () => console.log(`Frontend listening on port ${port}!`))
