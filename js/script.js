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

console.log(window);

searchBtn.addEventListener("click", (e) => {
  searchBtn.classList.add("active");
  searchMobile.classList.add("active");
  searchMobile.focus();

  if (window.innerWidth <= 767) {
    console.log("aaaa");
    logo.style.display = "none";
  }
});

searchMobile.addEventListener("focusout", () => {
  searchBtn.classList.remove("active");
  searchMobile.classList.remove("active");
  logo.style.display = "block";
});
