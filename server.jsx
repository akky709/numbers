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

app.post('/scrape', async (req, res) => {
  try {
    // スクレーピング対象URL
    // const url = 'https://takarakuji.rakuten.co.jp/backnumber/numbers4_detail/6481-6500/';
    const baseUrl = 'https://takarakuji.rakuten.co.jp/backnumber/numbers4_detail/';


    const numbers = [];


    // DBへ接続
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


      // データ挿入処理（重複を避ける）
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
    // console.log('取得したデータ一覧:', numbers);
    res.json({ results: numbers });
    // res.json({ success: true, inserted: numbers.length });


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'スクレーピングに失敗しました' });
  }

});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));