const cardsContainer = document.getElementById('cards-container');
const form = document.getElementById('form');
const search = document.getElementById('search');
const clearBtn = document.getElementById('clear');

const apiURL = 'https://api.lyrics.ovh';

async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

function showData(data) {
  cardsContainer.innerHTML = data.data
    .map(
      (song) =>
        `
    <div class="card">
        <div class="card-front active">
          <p><strong>${song.artist.name}</strong> - ${song.title}</p>
        </div>
        <div class="card-back" data-artist="${song.artist.name}" data-songtitle="${song.title}"></div>
       </div>
    `
    )
    .join('');
}

async function showLyrics(artist, songTitle, backEl) {
  try {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    backEl.innerHTML = `
            <h2><strong>${artist}</strong> -  ${songTitle}</h2>
            <p>${lyrics}</p>
    
    `;
  } catch (err) {
    alert('Sorry!!!There-s no lyrics for these song. ');
    window.location.reload();
  }
}

function cleanCardFront() {
  const cardFront = document.querySelectorAll('.card-front');
  cardFront.forEach((card) => {
    card.classList.remove('active');
  });
}
cardsContainer.addEventListener('click', (e) => {
  const clickedEl = e.target.parentElement;

  const backEl = clickedEl.getElementsByTagName('div')[1];

  const artist = backEl.getAttribute('data-artist');
  const songTitle = backEl.getAttribute('data-songtitle');
  cleanCardFront();

  backEl.classList.add('active');

  showLyrics(artist, songTitle, backEl);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

clearBtn.addEventListener('click', () => {
  localStorage.clear();
  cardsContainer.innerHTML = '';
  window.location.reload();
});
