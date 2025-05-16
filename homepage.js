document.addEventListener('DOMContentLoaded', () => {
  loadQuote();
  setupNavigationButtons();
  setupVoiceCommands();
});

function loadQuote() {
  fetch('https://zenquotes.io/api/random')
    .then(response => response.json())
    .then(data => {
      const quoteElement = document.getElementById('quote');
      quoteElement.textContent = `"${data[0].q}" - ${data[0].a}`;
    })
    .catch(error => {
      console.error('Error fetching quote:', error);
      const quoteElement = document.getElementById('quote');
      quoteElement.textContent = "Sorry, we couldn't load the quote at the moment.";
    });
}

function setupNavigationButtons() {
  const stocksButton = document.getElementById('stocks-button');
  const dogsButton = document.getElementById('dogs-button');

  if (stocksButton) {
    stocksButton.addEventListener('click', () => {
      window.location.href = 'stocks.html';
    });
  }

  if (dogsButton) {
    dogsButton.addEventListener('click', () => {
      window.location.href = 'dogs.html';
    });
  }
}

function setupVoiceCommands() {
  if (typeof annyang !== 'undefined') {
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
      }
    };

    annyang.addCommands(commands);
  } else {
    console.warn('Annyang is not available');
  }
}
