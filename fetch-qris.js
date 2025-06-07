require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;
const API_TOKEN = process.env.QRIS_API_TOKEN || 'changeme';

const COOKIES_PATH = 'qris-cookies.json';

async function fetchQrisData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let result = null;
  try {
    if (fs.existsSync(COOKIES_PATH)) {
      const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf8'));
      await page.setCookie(...cookies);
      await page.goto('https://merchant.qris.interactive.co.id/v2/m/kontenr.php?idir=pages/historytrx.php', { waitUntil: 'networkidle2' });
      const isLoggedIn = await page.evaluate(() => !!document.querySelector('body'));
      if (isLoggedIn) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        result = await page.evaluate(async () => {
          const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || window.X_TOKEN_CSRF || '';
          const formData = new URLSearchParams({
            draw: "3",
            "columns[0][data]": "DT_RowIndex",
            "columns[0][name]": "DT_RowIndex",
            "columns[0][searchable]": "false",
            "columns[0][orderable]": "false",
            "columns[0][search][value]": "",
            "columns[0][search][regex]": "false",
            "columns[1][data]": "tgl",
            "columns[1][name]": "",
            "columns[1][searchable]": "true",
            "columns[1][orderable]": "true",
            "columns[1][search][value]": "",
            "columns[1][search][regex]": "false",
            "columns[2][data]": "nominal",
            "columns[2][name]": "",
            "columns[2][searchable]": "true",
            "columns[2][orderable]": "true",
            "columns[2][search][value]": "",
            "columns[2][search][regex]": "false",
            "columns[3][data]": "nominal1",
            "columns[3][name]": "",
            "columns[3][searchable]": "true",
            "columns[3][orderable]": "true",
            "columns[3][search][value]": "",
            "columns[3][search][regex]": "false",
            "columns[4][data]": "tip",
            "columns[4][name]": "",
            "columns[4][searchable]": "true",
            "columns[4][orderable]": "true",
            "columns[4][search][value]": "",
            "columns[4][search][regex]": "false",
            "columns[5][data]": "status",
            "columns[5][name]": "",
            "columns[5][searchable]": "true",
            "columns[5][orderable]": "false",
            "columns[5][search][value]": "",
            "columns[5][search][regex]": "false",
            "columns[6][data]": "cs",
            "columns[6][name]": "",
            "columns[6][searchable]": "true",
            "columns[6][orderable]": "true",
            "columns[6][search][value]": "",
            "columns[6][search][regex]": "false",
            "columns[7][data]": "paytype",
            "columns[7][name]": "",
            "columns[7][searchable]": "true",
            "columns[7][orderable]": "true",
            "columns[7][search][value]": "",
            "columns[7][search][regex]": "false",
            "columns[8][data]": "rrn",
            "columns[8][name]": "",
            "columns[8][searchable]": "true",
            "columns[8][orderable]": "true",
            "columns[8][search][value]": "",
            "columns[8][search][regex]": "false",
            "columns[9][data]": "ket",
            "columns[9][name]": "",
            "columns[9][searchable]": "true",
            "columns[9][orderable]": "false",
            "columns[9][search][value]": "",
            "columns[9][search][regex]": "false",
            "columns[10][data]": "idtrans",
            "columns[10][name]": "",
            "columns[10][searchable]": "true",
            "columns[10][orderable]": "false",
            "columns[10][search][value]": "",
            "columns[10][search][regex]": "false",
            "columns[11][data]": "idinv",
            "columns[11][name]": "",
            "columns[11][searchable]": "true",
            "columns[11][orderable]": "false",
            "columns[11][search][value]": "",
            "columns[11][search][regex]": "false",
            "columns[12][data]": "datesettle",
            "columns[12][name]": "",
            "columns[12][searchable]": "true",
            "columns[12][orderable]": "false",
            "columns[12][search][value]": "",
            "columns[12][search][regex]": "false",
            "order[0][column]": "0",
            "order[0][dir]": "desc",
            "order[0][name]": "DT_RowIndex",
            start: "0",
            length: "5",
            "search[value]": "",
            "search[regex]": "false",
            range: "07/06/2025 - 07/06/2025",
            item: "",
            item_search: "",
            status: "all",
            limit: "100",
            store: "0"
          });
          const res = await fetch('https://merchant.qris.interactive.co.id/v2/m/proses.php?required=getTransactions', {
            method: 'POST',
            headers: {
              "Accept": "application/json, text/javascript, */*; q=0.01",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
              "X-TOKEN-CSRF": csrfToken,
              "X-ORIGIN": "https://merchant.qris.online"
            },
            body: formData
          });
          return await res.json();
        });
      } else {
        throw new Error('Cookies tidak valid atau session sudah expired.');
      }
    } else {
      throw new Error('File cookies tidak ditemukan. Ikuti instruksi di README untuk membuat qris-cookies.json.');
    }
  } finally {
    await browser.close();
  }
  return result;
}

// Middleware auth
function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '').trim();
  if (token !== API_TOKEN) return res.status(403).json({ error: 'Forbidden' });
  next();
}

app.get('/fetch', authMiddleware, async (req, res) => {
  try {
    const data = await fetchQrisData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('QRIS Mutasi Fetch Service is running. Use /fetch with Bearer token.');
});

app.listen(PORT, () => {
  console.log(`QRIS Mutasi Fetch Service listening on port ${PORT}`);
});
