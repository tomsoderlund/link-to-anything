const https = require('https')

const { queryObjectToString } = require('./helpers')

const config = {
  searchLocale: 'en-US', // 'sv-SE',
  searchLimit: 20
}

// Private functions

const responseHandler = function (resultsHandler, response) {
  let body = ''

  response.on('data', function (d) {
    body += d
  })

  response.on('end', function () {
    // console.log('\nRelevant Headers:\n');
    for (var header in response.headers) {
      // header keys are lower-cased by Node.js
      if (header.startsWith('bingapis-') || header.startsWith('x-msedge-')) {
        // console.log(header + ": " + response.headers[header]);
      }
    }
    resultsHandler(null, JSON.parse(body))
  })

  response.on('error', resultsHandler)
}

const subscriptionKey = process.env.BING_API_KEY
const host = 'api.cognitive.microsoft.com'
const path = '/bing/v7.0/search'

/*
  id: "https://api.cognitive.microsoft.com/api/v7/#WebPages.0",
  name: "Weld: Startsida",
  snippet: "Välkommen till Weldweb! ...",
  url: "http://www.weld.se/",
  dateLastCrawled: "2018-11-30T16:36:00.0000000Z",
  displayUrl: "www.weld.se",
  isFamilyFriendly: true,
  isNavigational: true
  language: "sv",
  deepLinks: [],
*/
let bingSearchCounter = 0

const searchBing = function (searchText, resultsHandler) {
  return new Promise(async (resolve, reject) => {
    if (!subscriptionKey) {
      reject(new Error('BING_API_KEY not set'))
    } else {
      console.log('Searching the Web for: ' + searchText)
      let requestParams = {
        method: 'GET',
        hostname: host,
        path: path + queryObjectToString({
          q: encodeURIComponent(searchText),
          mkt: config.searchLocale,
          count: config.searchLimit
        }),
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey
        }
      }

      bingSearchCounter++
      console.log(`searchBing (count: ${bingSearchCounter}): “${searchText}”`)

      let req = https.request(requestParams, responseHandler.bind(undefined, (err, results) => {
        if (err) { reject(err) } else { resolve(results) }
      }))
      req.end()
    }
  })
}

// Public API

module.exports = searchBing
