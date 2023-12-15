const http = require('http');
const axios = require('axios');

const port = 3000;

const server = http.createServer(async (req, res) => {
    try {
        const option = req.url.split('?')[1]?.split('=')[1] || '';
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data;

        let jsonData = [];

        let mainPageHtml = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                        }

                        h1 {
                            color: #333;
                        }

                        button {
                            background-color: #0074D9;
                            color: #fff;
                            border: none;
                            padding: 10px 20px;
                            cursor: pointer;
                            margin: 5px;
                        }
                    </style>
                    <title>Список країн</title>
                </head>
                <body>
                    <h1>Виберіть опцію:</h1>
                    <button onclick="location.href='/option?value=countries'">Переглянути всі країни світу</button>
                    <button onclick="location.href='/option?value=currencies'">Переглянути всі валюти світу</button>
                    <button onclick="location.href='/option?value=capitals'">Столиці світу</button>
                </body>
            </html>
        `;

        if (option === 'countries') {
            countries.forEach((country, index) => {
                jsonData.push({
                    number: index + 1,
                    country: country.name.common.toLowerCase(),
                });
            });
        } else if (option === 'currencies') {
            countries.forEach((country, index) => {
                if (country.currencies) {
                    const currencyNames = Array.isArray(country.currencies)
                        ? country.currencies.map((currency) => currency.name.toLowerCase())
                        : [country.currencies.name.toLowerCase()];

                    jsonData.push({
                        number: index + 1,
                        currencies: currencyNames,
                    });
                }
            });
        } else if (option === 'capitals') {
            countries.forEach((country, index) => {
                if (country.capital) {
                    const capitals = Array.isArray(country.capital)
                        ? country.capital.map((capital) => capital.toLowerCase())
                        : country.capital.toLowerCase();

                    jsonData.push({
                        number: index + 1,
                        capitals: capitals,
                    });
                }
            });
        }

        if (option !== '') {
            const jsonOutput = JSON.stringify(jsonData, null, 2);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
            res.end(jsonOutput);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end(mainPageHtml);
        }
    } catch (error) {
        console.error('Помилка у виконанні запиту:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('Помилка у виконанні запиту');
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
