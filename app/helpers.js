module.exports.queryObjectToString = queryObject => Object.keys(queryObject).reduce((result, key) => (queryObject[key] === undefined) ? result : result + (result.length ? '&' : '?') + key + '=' + queryObject[key], '')

// Returns array like '/:0/:1/:2/:etc'
module.exports.parseRequestParams = url => (url.split('?')[0] || '/').substr(1).split('/')

// Returns a req.query-type object
module.exports.parseRequestQuery = url => (url.split('?')[1] || '')
  .split('&')
  .reduce((result, propValue) => {
    const key = propValue.split('=')[0]
    if (key) result[key] = propValue.split('=')[1]
    return result
  }, {})
