const hamburger = document.querySelector('.navbar__hamburger');
const navMenu = document.querySelector('.navbar__menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('navbar--active');

    const icon = hamburger.querySelector('i, svg');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1440) {
        navMenu.classList.remove('navbar--active');
    }
});

document.addEventListener('click', (e) => {
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideMenu && !isClickOnHamburger) {
        navMenu.classList.remove('navbar--active');
    }
});
