// Just a test server for development, not used by Now hosting
require('dotenv').config()

const { createServer } = require('http')
const PORT = process.env.PORT || 3038

const controller = 'link'

createServer(require(`./${controller}`)).listen(PORT, () => console.log(`link-to-anything running on http://localhost:${PORT}, NODE_ENV: ${process.env.NODE_ENV}`))
