# mutasi-qris.id

**Automated QRIS transaction mutation fetcher for merchant.qris.interactive.co.id, ready for Docker deployment.**

Automate the retrieval of incoming QRIS payment transaction history from the merchant dashboard at merchant.qris.interactive.co.id on a scheduled basis, so that mutation data can be integrated into other systems (notifications, webhooks, etc.) without official API access.

- Automated QRIS mutation data fetch using Node.js and Puppeteer (headless browser).
- Stores and reuses login cookies so you don't need to log in manually every time.
- Automatic instructions if cookies are missing or the session is expired.
- Ready to run in Docker for modern server/infra needs.
- **HTTP API endpoint with Bearer token authorization for secure integration.**

- Docker (recommended for production deployment)
- Or: Node.js 18+ (for local development/testing)
- Internet access to https://merchant.qris.interactive.co.id

### 1. Clone/Download the Project
```
git clone https://github.com/gustiarto/mutasi-qris.id && cd mutasi-qris.id
```

### 2. Prepare QRIS Login Cookies (IMPORTANT)
**JANGAN gunakan script `document.cookie`!**
Agar session login valid, cookies harus diekspor dari DevTools tab Application, bukan dari JavaScript.

1. Login ke [QRIS dashboard](https://merchant.qris.interactive.co.id/v2/m/login/) di browser.
2. Tekan F12, buka tab **Application** (atau Storage di Firefox), lalu klik **Cookies** > pilih `merchant.qris.interactive.co.id`.
3. Pilih semua baris cookies, klik kanan lalu **Export as JSON** (atau copy-paste manual ke Notepad, lalu simpan sebagai `qris-cookies.json`).
4. Pastikan file `qris-cookies.json` berisi array JSON dengan atribut lengkap: `name`, `value`, `domain`, `path`, `httpOnly`, `secure`, dst. Contoh:
```json
[
  { "name": "PHPSESSID", "value": "...", "domain": "merchant.qris.interactive.co.id", "path": "/", "httpOnly": true, "secure": true }
]
```
> **Penting:** Cookie PHPSESSID harus ada dan httpOnly agar session login valid.

### 3. Build and Run in Docker (Recommended)
Set your API token for secure access to the HTTP endpoint:
```
docker build -t mutasi-qris .
docker run --rm -p 3030:3030 -e QRIS_API_TOKEN=yourtoken -v "${PWD}/qris-cookies.json:/app/qris-cookies.json" mutasi-qris
```
- Ganti `yourtoken` dengan token rahasia Anda.
- Service tersedia di `http://localhost:3030/fetch` (gunakan Bearer token).

### 4. Run Locally (Node.js)
```
npm install
$env:QRIS_API_TOKEN="yourtoken"  # PowerShell
# export QRIS_API_TOKEN=yourtoken  # Linux/Mac
npm run dev   # untuk development (auto-reload)
npm run prod  # untuk production
```

### 5. Fetch QRIS Data via HTTP API
Kirim GET ke `/fetch` dengan Bearer token:
```bash
curl -H "Authorization: Bearer yourtoken" http://localhost:3030/fetch
```

### 6. Update Cookies If Session Expires
Jika session expired, ulangi langkah 2 untuk update cookies.

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
