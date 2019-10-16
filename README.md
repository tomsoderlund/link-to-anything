# link-to-anything

Serve a screenshot inside an image frame.

Serverless lambda to be used with Zeit Now.

## Usage

    yarn dev

## Deploy on Zeit Now

    now -e BING_API_KEY=[YOUR CODE]

Go to

- Redirect: http://localhost:3038/?q=What is love?
- Get JSON: http://localhost:3038/?json=true&q=What is love?
- Locale: http://localhost:3038/?locale=sv-SE&json=true&q=What is love?
