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
  try {
    const urlFetchSearch = `https://gogoanime.consumet.org/search?keyw=${animeSearch}`;
    const fetchSearch = await fetch(urlFetchSearch);
    const fetchSearchJson = await fetchSearch.json();
    const anime = fetchSearchJson[0].animeId;

    // Utiliza o animeId para buscar as informações do anime.
    const urlFetchDetails = `https://gogoanime.consumet.org/anime-details/${anime}`;
    const fetchDetails = await fetch(urlFetchDetails);
    const fetchDetailsJson = await fetchDetails.json();

    return fetchDetailsJson;
  } catch (error) {
    window.location.href = window.location.origin + "/404.html";
  }
}

async function getTrailerData() {
  // Define o parámetro de busca através da URL
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  const animeSearch = searchParams.get("anime");

  // Faz busca na API do Kitsu para pegar informações complementares
  const fetchKitsuUrl = `https://kitsu.io/api/edge/anime?filter[text]=${animeSearch}`;
  const fetchKitsu = await fetch(fetchKitsuUrl);
  const kitsuDetails = await fetchKitsu.json();

  return kitsuDetails;
}

async function addAnimeDetails() {
  const animeDetails = await getAnimeInfo();
  const kitsuDetails = await getTrailerData();

  // Pega os elementos DOM da página
  const pageAnimeTitle = document.querySelector("#anime-single .video h1");
  const pageAnimeEpisodes = document.querySelector(".sinopse-content li.episodes");
  const pageAnimeStatus = document.querySelector(".sinopse-content li.status");
  const pageAnimeGeneros = document.querySelector(".sinopse-content li.genero");
  const pageAnimePosterWrapper = document.querySelector(".sinopse-img");
  const sinopse = document.querySelector(".sinopse-paragraph-content");
  const videoWrapper = document.querySelector(".video-embed");

  // Operador ternário para traduzir o status do anime
  const isAnimeFinished = animeDetails.status === "Completed" ? "Completo" : "Lançando";

  // Adiciona os valores e remove a class Skeleton
  pageAnimeTitle.classList.remove("skeleton");
  pageAnimeTitle.innerText = `${animeDetails.animeTitle} (${animeDetails.releasedDate})`;
  pageAnimeEpisodes.innerHTML = `<span class="info">Duração: </span><span class="info-content">${animeDetails.episodesList.length} Episódios.</span>`;
  pageAnimeStatus.innerHTML = `<span class="info">Status: </span><span class="info-content">${isAnimeFinished}.</span>`;
  pageAnimeGeneros.innerHTML = `<span class="info">Gêneros: </span><span class="info-content">${animeDetails.genres
    .slice(0, 3)
    .join(", ")}.</span>`;
  sinopse.classList.remove("skeleton");
  sinopse.innerText = `${animeDetails.synopsis}`;

  // Adiciona o poster
  const poster = document.createElement("img");
  poster.src = animeDetails.animeImg;
  poster.alt = animeDetails.animeTitle;
  pageAnimePosterWrapper.classList.remove("skeleton");
  pageAnimePosterWrapper.append(poster);

  // Pega o Trailer ID do YouTube
  const trailerID = kitsuDetails.data[0].attributes.youtubeVideoId;
  const youtubeEmbed = `<iframe src="https://www.youtube.com/embed/${trailerID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  videoWrapper.outerHTML = youtubeEmbed;
}

async function recentEpisodes() {
  const animeItemWrapper = document.querySelector("div.grid-latest");
  const popularItemWrapper = document.querySelector("div.grid-recent");

  // Fetch últimos episódios
  const urlFetch = "https://gogoanime.consumet.org/recent-release?page=1";
  const fetchRecent = await fetch(urlFetch);
  const recentJson = await fetchRecent.json();

  // Fetch Popular
  const urlFetchPopular = "https://gogoanime.consumet.org/popular";
  const fetchPopular = await fetch(urlFetchPopular);
  const popularJson = await fetchPopular.json();

  // Adiciona os últimos episódios ao grid.
  const recentEpisodes = recentJson.map((e, i) => {
    if (i < 10) {
      const animeItem = document.createElement("a");
      animeItem.setAttribute("href", "./anime.html" + "?anime=" + e.animeTitle);
      animeItem.classList.add("anime-item");
      animeItem.innerHTML = `
      <div class="cover">
      <span class="episode font-2-mr">Episódio ${e.episodeNum}</span>
      <img src="${e.animeImg}" alt="${e.animeTitle}" />
      </div>
      <span class="anime-title font-1-m">${e.animeTitle}</span>
      `;

      animeItemWrapper.append(animeItem);
      if (document.querySelector(".lds-ellipsis")) document.querySelector(".lds-ellipsis").remove();
    }
  });

  const popularEpisodes = popularJson.map((e, i) => {
    if (i < 6) {
      const animeItem = document.createElement("a");
      animeItem.setAttribute("href", "./anime.html" + "?anime=" + e.animeTitle);
      animeItem.classList.add("anime-item");
      animeItem.innerHTML = `
      <div class="cover">
      
      <img src="${e.animeImg}" alt="${e.animeTitle}" />
      </div>
      <span class="anime-title font-1-m">${e.animeTitle}</span>
      `;
      popularItemWrapper.append(animeItem);
      if (document.querySelector(".lds-ellipsis")) document.querySelector(".lds-ellipsis").remove();
    }
  });

  // Add style de Grid de volta aos Wrappers
  popularItemWrapper.style.cssText = "display:grid";
  animeItemWrapper.style.cssText = "display:grid";
}

function searchAnime() {
  const searchBar = document.querySelector("#search");
  const searchMobile = document.querySelector("#search-mobile");
  const searchButton = document.querySelector("#search-btn");

  searchBar.addEventListener("keyup", search);
  searchMobile.addEventListener("keyup", searchMobileEvent);

  searchButton.addEventListener("click", search);

  function search(event) {
    console.log(event);

    if (event.type === "keyup") {
      if (searchBar.value.length !== 0) {
        searchButton.classList.add("ativo");
      } else {
        searchButton.classList.remove("ativo");
      }
    }

    if (event.code === "Enter" || (event.type === "click" && searchBar.value.length !== 0)) {
      window.location.href = window.location.origin + "/search.html?q=" + searchBar.value;
    }

    if (event.code === "Enter" || (event.type === "click" && searchBar.value.length === 0)) {
      searchBar.classList.add("invalido");
      console.log(searchBar.classList);
    } else {
      searchBar.classList.remove("invalido");
    }
  }

  function searchMobileEvent(event) {
    if (event.code === "Enter" && searchMobile.value.length !== 0) {
      window.location.href = window.location.origin + "/search.html?q=" + searchMobile.value;
    }

    if (event.code === "Enter" && searchMobile.value.length === 0) {
      searchMobile.classList.add("invalido");
    }
  }
}

async function searchResults() {
  const searchQuery = new URLSearchParams(window.location.search);
  const fetchUrl = "https://gogoanime.consumet.org/search?keyw=" + searchQuery.get("q");

  // Start Fetch
  const fetchQuery = await fetch(fetchUrl);
  const bodyFetch = await fetchQuery.json();

  // Alterar HTML
  const searchHeader2 = document.querySelector(".font-1-xl.search-query");
  searchHeader2.innerText = searchQuery.get("q");

  // remove itens antigos
  document.querySelector(".search-results").replaceChildren();

  console.log(bodyFetch);

  // Cria a lista
  for (result of bodyFetch) {
    // Cria HTML para cada item da Lista
    const wrapperLi = document.createElement("li");
    wrapperLi.setAttribute("class", "result-item");
    wrapperLi.innerHTML = `
    <a href="${window.location.origin}/anime.html?anime=${result.animeId}">
    <div class="sinopse-img skeleton"></div>
    <div class="result-container">
    <h3 class="skeleton font-1-m">${result.animeTitle}</h3>
    <p class="skeleton font-1-m">${result.status}</p>
    </div>
    </a>
    `;

    // Cria o Poster
    const poster = document.createElement("img");
    poster.src = result.animeImg;
    poster.alt = result.animeTitle;
    wrapperLi.querySelector(".sinopse-img").classList.remove("skeleton");
    wrapperLi.querySelector(".sinopse-img").append(poster);

    // Append HTML
    document.querySelector(".search-results").append(wrapperLi);
  }
}

searchAnime();

if (window.location.pathname === "/") recentEpisodes();

if (window.location.pathname.includes("anime.html")) addAnimeDetails();

if (window.location.pathname.includes("search.html")) searchResults();
