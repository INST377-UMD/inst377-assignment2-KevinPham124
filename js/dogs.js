// js/dogs.js

let siemaInstance = null;

// Load 10 random dog images into Siema carousel
fetch('https://dog.ceo/api/breeds/image/random/10')
  .then(res => res.json())
  .then(data => {
    const carousel = document.getElementById('carousel');
    data.message.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      carousel.appendChild(img);
    });

    // Initialize Siema (manual only)
    siemaInstance = new Siema({ loop: true });

    // Button controls
    document.getElementById('prev-btn').addEventListener('click', () => siemaInstance.prev());
    document.getElementById('next-btn').addEventListener('click', () => siemaInstance.next());
  });

// Load all dog breeds as buttons
fetch('https://dogapi.dog/api/v2/breeds')
  .then(res => res.json())
  .then(data => {
    const buttonsDiv = document.getElementById('breed-buttons');
    data.data.forEach(breed => {
      const btn = document.createElement('button');
      btn.className = 'custom-button';
      btn.textContent = breed.attributes.name;
      btn.setAttribute('data-id', breed.id);
      buttonsDiv.appendChild(btn);
    });

    buttonsDiv.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        showBreedInfo(e.target.getAttribute('data-id'));
      }
    });
  });

function showBreedInfo(breedId) {
  fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`)
    .then(res => res.json())
    .then(data => {
      const breed = data.data.attributes;
      document.getElementById('breed-name').textContent = breed.name;
      document.getElementById('breed-description').textContent = breed.description;
      document.getElementById('breed-lifespan').textContent = `${breed.life.min} - ${breed.life.max}`;
      document.getElementById('breed-info').classList.remove('hidden');
    });
}

// Voice command: "Load dog breed <name>"
if (annyang) {
  annyang.addCommands({
    'load dog breed *breed': (breed) => {
      const buttons = document.querySelectorAll('#breed-buttons button');
      for (const btn of buttons) {
        if (btn.textContent.toLowerCase() === breed.toLowerCase()) {
          btn.click();
          break;
        }
      }
    }
  });
}
