// Mobile Menu
const menuBtn = document.querySelector('[data-menu="menu"]');
const menu = document.querySelector(".menu-links");

menuBtn.addEventListener("click", toggleMenu);

function toggleMenu(event) {
  menu.classList.toggle("ativo");
}

document.addEventListener("click", closeMenu);

function closeMenu(event) {
  const isOutsideClick = menu.contains(event.target);

  if (!isOutsideClick && event.target !== menuBtn) {
    menu.classList.remove("ativo");
  }
}

// Search
const searchBtn = document.querySelector(".search-icon");
const searchMobile = document.querySelector("#search-mobile");
const logo = document.querySelector(".font-1-logo");

searchBtn.addEventListener("click", (e) => {
  searchBtn.classList.add("active");
  searchMobile.classList.add("active");
  searchMobile.focus();

  if (window.innerWidth <= 767) {
    logo.style.display = "none";
  }
});

searchMobile.addEventListener("focusout", () => {
  searchBtn.classList.remove("active");
  searchMobile.classList.remove("active");
  logo.style.display = "block";
});

// Single Anime fetch Info from anime
async function getAnimeInfo() {
  // Define o parámetro de busca através da URL
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  const animeSearch = searchParams.get("anime");

  // Busca pelo anime usando a API do gogoanime com base no parámetro da URL e retorna o animeId
  const urlFetchSearch = `https://gogoanime.herokuapp.com/search?keyw=${animeSearch}`;
  const fetchSearch = await fetch(urlFetchSearch);
  const fetchSearchJson = await fetchSearch.json();
  const anime = fetchSearchJson[0].animeId;

  // Utiliza o animeId para buscar as informações do anime.
  const urlFetchDetails = `https://gogoanime.herokuapp.com/anime-details/${anime}`;
  const fetchDetails = await fetch(urlFetchDetails);
  const fetchDetailsJson = await fetchDetails.json();
  return fetchDetailsJson;
}

async function addAnimeDetails() {
  const animeDetails = await getAnimeInfo();
  const pageAnimeTitle = document.querySelector("#anime-single .video h1");
  const pageAnimeDuracao = document.querySelector(".sinopse-content li.duracao");
  const pageAnimeStudio = document.querySelector(".sinopse-content li.studio");
  const pageAnimeEpisodes = document.querySelector(".sinopse-content li.episodes");
  const pageAnimePosterWrapper = document.querySelector(".sinopse-img");
  const sinopse = document.querySelector(".sinopse-paragraph-content");
}

addAnimeDetails();
