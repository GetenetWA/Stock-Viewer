import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Supabase Connection (25 pts requirement)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// AUTHORED API 1: Retrieve Watchlist (Database Read)
app.get('/api/watchlist', async (req, res) => {
    try {
        const { data, error } = await supabase.from('watchlist').select('*').order('id', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AUTHORED API 2: Add to Watchlist (Database Write + Duplicate Check)
app.post('/api/watchlist', async (req, res) => {
    const { symbol } = req.body;
    const ticker = symbol.toUpperCase();
    try {
        const { data: existing } = await supabase.from('watchlist').select('symbol').eq('symbol', ticker);
        if (existing && existing.length > 0) return res.status(409).json({ error: "Duplicate" });

        const { error } = await supabase.from('watchlist').insert([{ symbol: ticker }]);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AUTHORED API 3: Stock ROI (Data Manipulation requirement)
app.get('/api/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const days = req.query.days || 30;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;

    try {
        const response = await fetch(url);
        const json = await response.json();
        if (json['Note']) return res.status(429).json({ error: "API Limit Reached" });
        
        const timeSeries = json['Time Series (Daily)'];
        if (!timeSeries) return res.status(404).json({ error: "Not found" });

        const dates = Object.keys(timeSeries).sort().slice(-days);
        const firstPrice = parseFloat(timeSeries[dates[0]]['4. close']);
        
        const history = dates.map(date => ({
            date,
            investmentValue: (100 * (parseFloat(timeSeries[date]['4. close']) / firstPrice)).toFixed(2)
        }));
        res.json({ ticker: symbol, history });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
