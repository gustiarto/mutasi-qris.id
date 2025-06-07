# mutasi-qris.id

**Automated QRIS transaction mutation fetcher for merchant.qris.interactive.co.id, ready for Docker deployment.**

Automate the retrieval of incoming QRIS payment transaction history from the merchant dashboard at merchant.qris.interactive.co.id on a scheduled basis, so that mutation data can be integrated into other systems (notifications, webhooks, etc.) without official API access.

- Automated QRIS mutation data fetch using Node.js and Puppeteer (headless browser).
- Stores and reuses login cookies so you don't need to log in manually every time.
- Automatic instructions if cookies are missing or the session is expired.
- Ready to run in Docker for modern server/infra needs.

- Docker (recommended for production deployment)
- Or: Node.js 18+ (for local development/testing)
- Internet access to https://merchant.qris.interactive.co.id

### 1. Clone/Download the Project
```
git clone <repo-url> && cd mutasi-qris.id
```

### 2. Prepare QRIS Login Cookies
Since the QRIS dashboard uses anti-bot protection and ReCaptcha, automatic login is not supported. Please follow these steps:

1. Open your browser on your local PC and log in to the [QRIS dashboard](https://merchant.qris.interactive.co.id/v2/m/kontenr.php?idir=pages/historytrx.php).
2. After logging in, open DevTools (F12) > Console.
3. Paste and run the following JavaScript to export all cookies as JSON:
```javascript
copy(JSON.stringify(document.cookie.split('; ').map(c => { const [name, ...v] = c.split('='); return { name, value: v.join('=') }; })))
```
4. Paste the copied JSON into a file named `qris-cookies.json` in the project folder. If needed, add the domain property manually for each cookie:
```json
[
  { "name": "PHPSESSID", "value": "...", "domain": ".qris.interactive.co.id" },
  ...
]
```

### 3. Build and Run in Docker
```
docker build -t mutasi-qris .
docker run --rm -v %cd%:/app mutasi-qris
```
- For Linux/Mac use `$(pwd)` instead of `%cd%`.
- The script will automatically use the existing cookies, fetch mutation data, and display the results in the log.

### 4. Update Cookies If Session Expires
If the log displays manual instructions, repeat step 2 to update the cookies.

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
