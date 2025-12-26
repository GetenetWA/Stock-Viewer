let stockChart;

async function getGrowthData() {
    const symbol = document.getElementById('symbolInput').value.toUpperCase();
    const timeframe = document.getElementById('timeframe').value;
    if (!symbol) return alert("Enter a symbol");

    try {
        const response = await fetch(`/api/stock/${symbol}?days=${timeframe}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        renderChart(data.ticker, data.history.map(d => d.date), data.history.map(d => d.investmentValue));
    } catch (err) { alert(err.message); }
}

function renderChart(ticker, labels, values) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (stockChart) stockChart.destroy();
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{ label: `$100 in ${ticker}`, data: values, borderColor: '#2ecc71', fill: true }]
        }
    });
}

async function addToWatchlist() {
    const symbol = document.getElementById('symbolInput').value.toUpperCase();
    const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ symbol })
    });
    if (res.status === 409) return alert("Already in watchlist!");
    if (res.ok) { alert("Added!"); loadWatchlist(); }
}

async function loadWatchlist() {
    const list = document.getElementById('watchlist');
    if (!list) return;
    const res = await fetch('/api/watchlist');
    const data = await res.json();
    list.innerHTML = "";

    for (const item of data) {
        const li = document.createElement('li');
        li.className = "watchlist-item";
        li.innerHTML = `<strong>${item.symbol}</strong> <span id="p-${item.symbol}">Loading...</span>`;
        list.appendChild(li);

        fetch(`/api/stock/${item.symbol}?days=1`).then(r => r.json()).then(p => {
            const price = p.history ? `$${p.history[p.history.length-1].investmentValue}` : "Limit";
            document.getElementById(`p-${item.symbol}`).innerText = price;
        });
    }
    if (window.anime) anime({ targets: '.watchlist-item', opacity: [0,1], translateX: [-20,0], delay: anime.stagger(100) });
}
window.onload = loadWatchlist;
