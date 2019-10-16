//
// Name:    link.js
// Purpose: Controller for parsing links
// Creator: Tom Söderlund
//

const { parseRequestQuery } = require('./helpers')
const searchBing = require('./searchBing')

const getUrlsForQuery = async function (searchText, options) {
  const results = await searchBing(searchText, options)
  const allUrls = results.webPages.value.map(webpage => webpage.url)
  return [allUrls, results.webPages.value]
}

const serveJSON = async function (req, res) {
  const query = parseRequestQuery(req.url)
  const searchText = decodeURIComponent(query.q)
  const [allUrls, allWebsites] = await getUrlsForQuery(searchText, query)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({
    query: searchText,
    url: allUrls[0],
    name: allWebsites[0].name,
    snippet: allWebsites[0].snippet,
    'all_urls': allUrls
  }))
}

const redirectToUrl = async function (req, res) {
  const query = parseRequestQuery(req.url)
  const searchText = decodeURIComponent(query.q)
  const [allUrls] = await getUrlsForQuery(searchText, query)
  res.writeHead(302, { 'Location': allUrls[0] })
  res.end()
}

const serve404 = function (req, res) {
  const message = `Not found: ${req.url}`
  res.statusCode = 404
  res.statusMessage = message
  res.end(message)
}

const serve500 = function (err, res) {
  console.error(err.message)
  res.statusCode = 500
  res.statusMessage = err.message
  res.end(err.message)
}

const router = async function (req, res) {
  try {
    const { url } = req
    console.log(`Incoming:`, url)
    if (url.includes('/favicon.ico')) {
      // favicon.ico always requested by browser
      await serve404(req, res)
    } else if (url.includes('json=true')) {
      await serveJSON(req, res)
    } else {
      await redirectToUrl(req, res)
    }
  } catch (err) {
    serve500(err, res)
  }
}

module.exports = router
