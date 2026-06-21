const hamburger = document.querySelector('.navbar__hamburger');
const navbarRight = document.querySelector('.navbar__right');

hamburger.addEventListener('click', () => {
    navbarRight.classList.toggle('navbar--active');
});
