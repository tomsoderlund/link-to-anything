# link-to-anything

Link to any search phrase – like Google’s “I’m lucky” feature.

- Serverless lambda to be used with Zeit Now.
- Uses Microsoft Bing search API.


## Usage

Set `BING_API_KEY` in an `.env` file.

    yarn dev

Examples:

- Redirect (302): http://localhost:3038/?q=What+is+love?
- Get JSON: http://localhost:3038/?json=true&q=What+is+love?
- Remove domains: http://localhost:3038/?remove=youtube,wikipedia&json=true&q=What+is+love?
- Locale: http://localhost:3038/?locale=sv-SE&json=true&q=What+is+love?


## Deploy on Zeit Now

    now -e BING_API_KEY=[YOUR API KEY]
