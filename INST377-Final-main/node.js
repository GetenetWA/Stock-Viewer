const API_KEY = '49YH98VDH11QPVSH';
const symbol = 'IBM';
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;

async function testAlphaVantage() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data['Error Message']) {
            console.error("API Error:", data['Error Message']);
        } else if (data['Note']) {
            console.warn("Rate Limit Hit:", data['Note']);
        } else {
            console.log("Success! Data received for:", data['Meta Data']['2. Symbol']);
            console.log("Latest Time Entry:", Object.keys(data['Time Series (5min)'])[0]);
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

testAlphaVantage();