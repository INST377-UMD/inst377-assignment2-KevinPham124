const apiKey = 'MOD7f_IkIuE7Y8IQIyPjiZXirMqfOBGC';

document.getElementById('load-stock').addEventListener('click', () => {
  const ticker = document.getElementById('ticker-input').value.toUpperCase();
  const days = parseInt(document.getElementById('days-select').value);
  if (!ticker) return alert('Please enter a ticker');

  loadStockChart(ticker, days);
});

function loadStockChart(ticker, days) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const from = startDate.toISOString().split('T')[0];
  const to = endDate.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        alert('Please enter a valid ticker');
        return;
      }

      const labels = data.results.map(pt => new Date(pt.t).toLocaleDateString());
      const values = data.results.map(pt => pt.c);

      const ctx = document.getElementById('stockChart').getContext('2d');
      if (window.stockChartInstance) window.stockChartInstance.destroy();

      window.stockChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `Closing Price of ${ticker}`,
            data: values,
            borderWidth: 2
          }]
        }
      });
    });
}

// Top 5 Stocks on Reddit 
fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
  .then(res => res.json())
  .then(data => {
    const top5 = data.slice(0, 5);
    const tbody = document.getElementById('reddit-stocks');
    top5.forEach(stock => {
      const row = document.createElement('tr');
      const icon = stock.sentiment.toLowerCase() === 'bullish' 
        ? '🐂⬆️' 
        : '🐻⬇️';

      row.innerHTML = `
        <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
        <td>${stock.no_of_comments}</td>
        <td>${icon}</td>
      `;
      tbody.appendChild(row);
    });
  });

// Annyang: "Lookup MSFT"
if (annyang) {
  annyang.addCommands({
    'lookup *stock': (stock) => {
      document.getElementById('ticker-input').value = stock.toUpperCase();
      document.getElementById('days-select').value = '30';
      loadStockChart(stock.toUpperCase(), 30);
    }
  });
}
