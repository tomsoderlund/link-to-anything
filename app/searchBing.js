/*
  {
    _type: 'SearchResponse',
    queryContext: { originalQuery: 'undefined', askUserForLocation: true },
    webPages: {
      webSearchUrl: 'https://www.bing.com/search?q=undefined',
      totalEstimatedMatches: 661000000,
      value: [ [Object], [Object] ]
    },
    entities: { value: [ [Object] ] },
    relatedSearches: {
      id: 'https://api.cognitive.microsoft.com/api/v7/#RelatedSearches',
      value: [ [Object], [Object] ]
    },
    videos: {
      id: 'https://api.cognitive.microsoft.com/api/v7/#Videos',
      readLink: 'https://api.cognitive.microsoft.com/api/v7/videos/search?q=undefined',
      webSearchUrl: 'https://www.bing.com/videos/search?q=undefined',
      isFamilyFriendly: true,
      value: [ [Object], [Object] ],
      scenario: 'List'
    },
    rankingResponse: { mainline: { items: [Array] }, sidebar: { items: [Array] } }
  }

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

const https = require('https')

const { queryObjectToString } = require('./helpers')

const searchLimit = process.env.SEARCH_LIMIT || 20
const subscriptionKey = process.env.BING_API_KEY
const host = 'api.cognitive.microsoft.com'
const path = '/bing/v7.0/search'

// Private functions

const responseHandler = function (resultsHandler, response) {
  let body = ''

  response.on('data', function (d) {
    body += d
  })

  response.on('end', function () {
    resultsHandler(null, JSON.parse(body))
  })

  response.on('error', resultsHandler)
}

let bingSearchCounter = 0

const searchBing = function (searchText, options = {}) {
  return new Promise((resolve, reject) => {
    if (!subscriptionKey) {
      reject(new Error('BING_API_KEY not set'))
    } else {
      const requestParams = {
        method: 'GET',
        hostname: host,
        path: path + queryObjectToString({
          q: encodeURIComponent(searchText),
          mkt: options.locale || 'en-US', // 'sv-SE'
          count: searchLimit
        }),
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey
        }
      }

      bingSearchCounter++
      console.log(`Search Bing (count: ${bingSearchCounter}): “${searchText}”`)

      let req = https.request(requestParams, responseHandler.bind(undefined, (err, results) => {
        if (err) { reject(err) } else { resolve(results) }
      }))
      req.end()
    }
  })
}

// Public API

module.exports = searchBing
