# TestMu Assignment

Puppeteer automation scripts for Amazon.in device search.

## Setup

```bash
npm install
```

Create a `.env` file:

TMU_USERNAME=your_username
TMU_ACCESS_KEY=your_access_key

## Scripts

| Command | Description |
|---|---|
| `npm test` | Single test |
| `npm run test:iphone` | iPhone test locally |
| `npm run test:galaxy` | Galaxy test locally |
| `npm run test:parallel` | Both tests in parallel locally |
| `npm run test:cloud` | Both tests on cloud |

## What it does

- Opens Amazon.in
- Searches for a device
- Fetches the price
- Adds the product to cart
