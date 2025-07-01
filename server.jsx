require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// mySQL接続設定
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

// データベース接続を作成する関数
const createConnection = () => {
  return mysql.createConnection(dbConfig);
};

// 全データ取得API
app.get('/api/numbers', async (req, res) => {
  try {
    const connection = createConnection();
    
    const [rows] = await connection.promise().execute(
      'SELECT * FROM numbers4 ORDER BY id DESC'
    );
    
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error('データ取得エラー:', err);
    res.status(500).json({ error: 'データの取得に失敗しました' });
  }
});

// 検索API
app.get('/api/numbers/search', async (req, res) => {
  try {
    const { number, startDate, endDate, limit = 100 } = req.query;
    const connection = createConnection();
    
    console.log('検索パラメータ:', { number, startDate, endDate, limit });
    
    let query = 'SELECT * FROM numbers4 WHERE 1=1';
    const params = [];
    
    // 数字検索の改善
    if (number && number.trim() !== '') {
      const searchNumber = number.trim();
      
      // 完全一致または部分一致で検索
      if (searchNumber.length === 4) {
        // 4桁の場合は完全一致
        query += ' AND numbers = ?';
        params.push(searchNumber);
      } else {
        // 部分一致の場合
        query += ' AND (numbers LIKE ? OR numbers LIKE ? OR numbers LIKE ? OR numbers LIKE ?)';
        // 先頭、末尾、中間での部分一致を検索
        params.push(`${searchNumber}%`);  // 先頭一致
        params.push(`%${searchNumber}`);  // 末尾一致
        params.push(`%${searchNumber}%`); // 中間一致
        params.push(searchNumber);        // 完全一致（短い数字の場合）
      }
    }
    
    if (startDate && startDate.trim() !== '') {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate && endDate.trim() !== '') {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY id DESC LIMIT ?';
    params.push(parseInt(limit));
    
    console.log('実行するクエリ:', query);
    console.log('パラメータ:', params);
    
    const [rows] = await connection.promise().execute(query, params);
    
    console.log('検索結果件数:', rows.length);
    
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error('検索エラー:', err);
    res.status(500).json({ error: '検索に失敗しました', details: err.message });
  }
});

// 統計データAPI
app.get('/api/numbers/stats', async (req, res) => {
  try {
    const connection = createConnection();
    
    // 各桁の出現頻度を取得
    const [rows] = await connection.promise().execute(
      'SELECT numbers FROM numbers4 ORDER BY id DESC'
    );
    
    // 数字の出現頻度を計算
    const digitFrequency = {
      0: Array(10).fill(0),
      1: Array(10).fill(0),
      2: Array(10).fill(0),
      3: Array(10).fill(0)
    };
    
    rows.forEach(row => {
      const numbers = row.numbers.toString().padStart(4, '0');
      for (let i = 0; i < 4; i++) {
        const digit = parseInt(numbers[i]);
        digitFrequency[i][digit]++;
      }
    });
    
    await connection.end();
    res.json({ digitFrequency, totalCount: rows.length });
  } catch (err) {
    console.error('統計データ取得エラー:', err);
    res.status(500).json({ error: '統計データの取得に失敗しました' });
  }
});

app.post('/scrape', async (req, res) => {
  try {
    const baseUrl = 'https://takarakuji.rakuten.co.jp/backnumber/numbers4_detail/';
    const numbers = [];
    const connection = await mysql.createConnection(dbConfig);

    for (let i = 101; i <= 1000; i += 20) {
      const start = String(i).padStart(4, '0');
      const end = i + 19;
      if (end > 6500) end = 6500;

      const endIndex = String(end).padStart(4, '0');
      const url = `${baseUrl}${start}-${endIndex}/`;

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      console.log('アクセス中：', url)

      $('.tblNumbers4 tbody tr').not(':first-child').each((index, elem) => {
        const count = $(elem).find('td').first().text().trim();
        const countString = parseInt(count.replace(/[^\d]/g, ''), 10);

        const date = $(elem).find('td').eq(1).text().trim();
        const dateString = date.replace(/\//g, '-');

        const number = $(elem).find('td').last().text().trim();

        numbers.push({
          count: countString,
          date: dateString,
          number: number
        });
      });

      for (const row of numbers) {
        await connection.execute(
          `INSERT INTO numbers4 (id, \`date\`, numbers)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         \`date\` = VALUES(\`date\`), 
         numbers = VALUES(numbers)`,
          [row.count, row.date, row.number]
        );
      }

      await new Promise(resoleve => setTimeout(resoleve, 1000));
    }

    await connection.end();

    console.log('保存完了:', numbers.length, '件');
    res.json({ results: numbers });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'スクレーピングに失敗しました' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));