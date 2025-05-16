document.addEventListener('DOMContentLoaded', () => {
  loadDogImages();
  loadDogBreeds();
  setupVoiceCommands();
});

let currentImageIndex = 0;  // Track the current image

function loadDogImages() {
  fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(response => response.json())
    .then(data => {
      const carouselImagesContainer = document.querySelector('.carousel-images');
      data.message.forEach((imgUrl, index) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Dog ${index + 1}`;
        img.classList.add('carousel-image');
        carouselImagesContainer.appendChild(img);
      });

      updateCarouselImage();
    });
}

function updateCarouselImage() {
  const images = document.querySelectorAll('.carousel-images img');
  images.forEach((img, index) => {
    img.style.display = (index === currentImageIndex) ? 'block' : 'none';
  });
}

function setupArrowNavigation() {
  const prevButton = document.getElementById('prev-btn');
  const nextButton = document.getElementById('next-btn');

  prevButton.addEventListener('click', () => {
    const images = document.querySelectorAll('.carousel-images img');
    if (currentImageIndex > 0) {
      currentImageIndex--;
    } else {
      currentImageIndex = images.length - 1;
    }
    updateCarouselImage();
  });

  nextButton.addEventListener('click', () => {
    const images = document.querySelectorAll('.carousel-images img');
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
    } else {
      currentImageIndex = 0;
    }
    updateCarouselImage();
  });
}

function loadDogBreeds() {
  fetch('https://api.thedogapi.com/v1/breeds')
    .then(response => response.json())
    .then(data => {
      const breedButtons = document.getElementById('breed-buttons');
      data.forEach(breed => {
        const button = document.createElement('button');
        button.textContent = breed.name;
        button.classList.add('custom-button');
        button.addEventListener('click', () => showBreedInfo(breed));
        breedButtons.appendChild(button);
        
      });
    });
}

function showBreedInfo(breed) {
  const container = document.getElementById('breed-info');
  container.innerHTML = `
    <h3>${breed.name}</h3>
    <p><strong>Description:</strong> ${breed.temperament || 'N/A'}</p>
    <p><strong>Life Span:</strong> ${breed.life_span}</p>
  `;
  container.style.display = 'block';
}

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
      'load dog breed *breed': (breedName) => {
        fetch('https://api.thedogapi.com/v1/breeds')
          .then(response => response.json())
          .then(data => {
            const match = data.find(breed => breed.name.toLowerCase() === breedName.toLowerCase());
            if (match) showBreedInfo(match);
            else alert('Breed not found');
          });
      }
    };

    annyang.addCommands(commands);
    annyang.start();
  }

  document.getElementById('audio-on').addEventListener('click', () => {
    if (annyang) annyang.start();
  });

  document.getElementById('audio-off').addEventListener('click', () => {
    if (annyang) annyang.abort();
  });
}