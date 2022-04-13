const express = require('express');
const https = require('https');
const app = express();
const port = 3001;

app.get('/markets/:coin1/:coin2/candles', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    https.get(`https://ftx.com/api/markets/${req.params.coin1}/${req.params.coin2}/candles?resolution=${req.query.resolution}`, resp => {
        resp.on('data', d => {
            res.write(d);
        });
        resp.on('end', () => {
            res.end();
        });
    }).on('error', e => {
        console.error(e);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});