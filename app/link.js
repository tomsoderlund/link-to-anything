//
// Name:    page.js
// Purpose: Controller and routing for full page text
// Creator: Tom Söderlund
//

const fs = require('fs')
const { parseRequestParams, parseRequestQuery } = require('./helpers')
const searchBing = require('./searchBing')

const getUrlsForQuery = async function (query) {
  const results = await searchBing(query)
  const allUrls = results.webPages.value.map(webpage => webpage.url)
  return allUrls
}

const serveJSON = async function (req, res) {
  const query = parseRequestQuery(req.url)
  const searchQuery = decodeURIComponent(query.q)
  const allUrls = await getUrlsForQuery(searchQuery)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({
    query: searchQuery,
    url: allUrls[0],
    'all_urls': allUrls
  }))
}

const redirectToUrl = async function (req, res) {
  const query = parseRequestQuery(req.url)
  const searchQuery = decodeURIComponent(query.q)
  const allUrls = await getUrlsForQuery(searchQuery)
  res.writeHead(302, { 'Location': allUrls[0] })
  res.end()
}

const serveError = function (err, res) {
  console.error(err.message)
  res.statusCode = 500
  res.statusMessage = err.message
  res.end(err.message)
}

const router = async function (req, res) {
  try {
    const { url } = req
    if (url.includes('json=true')) {
      serveJSON(req, res)
    } else {
      redirectToUrl(req, res)
    }
  } catch (err) {
    serveError(err, res)
  }
}

module.exports = router
