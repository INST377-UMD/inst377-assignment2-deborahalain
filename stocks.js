document.addEventListener('DOMContentLoaded', () => {
  setupVoiceCommands();
  setupStockSearch();
  loadTopStocks();
});

function setupVoiceCommands() {
  if (annyang) {
    const commands = {
      'hello': () => alert('Hello world!'),
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'navigate to *page': (page) => {
        const target = page.toLowerCase();
        if (target.includes('home')) window.location.href = 'homepage.html';
        else if (target.includes('stocks')) window.location.href = 'stocks.html';
        else if (target.includes('dogs')) window.location.href = 'dogs.html';
      },
      'lookup *stock': (stock) => {
        document.getElementById('stockTicker').value = stock;
        const days = 30;
        getStockData(stock, days);
      }
    };

    annyang.addCommands(commands);
    annyang.start();
  }

  document.getElementById('micon').addEventListener('click', () => {
    if (annyang) annyang.start();
  });

  document.getElementById('micoff').addEventListener('click', () => {
    if (annyang) annyang.abort();
  });
}

function setupStockSearch() {
  document.getElementById('lookupStock').addEventListener('click', () => {
    const ticker = document.getElementById('stockTicker').value;
    const days = document.getElementById('dateRange').value;
    getStockData(ticker, days);
  });
}

function getStockData(ticker, days) {
  const apiKey = 'VzorpXz4mUkxHZfWT1QBOC3Pe4YsChdQ';

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - days);
  const startDate = currentDate.toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apiKey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const stockData = data.results;
      if (stockData && stockData.length > 0) {
        const chartData = stockData.map(item => ({
          x: new Date(item.t * 1000),
          y: item.c
        }));

        displayStockChart(chartData);
      } else {
        alert('Not working');
      }
    })
    .catch(error => {
      console.error('Error fetching stock data:', error);
      alert('Could not retrieve stock data.');
    });
}

function displayStockChart(chartData) {
  const ctx = document.getElementById('stockChart').getContext('2d');

  if (window.stockChart) {
    window.stockChart.destroy();
  }

  window.stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Stock Price',
        data: chartData,
        borderColor: '#3e95cd',
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'll'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price (USD)'
          }
        }
      }
    }
  });
}

function loadTopStocks() {
  fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#redditTable tbody');
      tableBody.innerHTML = '';

      const topStocks = data.slice(0, 5);

      topStocks.forEach(stock => {
        const row = document.createElement('tr');
        const iconSrc = stock.sentiment === 'Bullish'
          ? 'images/bullishicon.png'
          : 'images/bearishicon.png';

        row.innerHTML = `
          <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
          <td>${stock.comment_count}</td>
          <td>${stock.sentiment}</td>
          <td><img src="${iconSrc}" alt="${stock.sentiment}" width="24" height="24"></td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching top stocks:', error);
      alert('Could not load top Reddit stocks.');
    });
}