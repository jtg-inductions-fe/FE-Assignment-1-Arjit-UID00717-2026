const hamburger = document.querySelector('.navbar__hamburger');
const navMenu = document.querySelector('.navbar__menu');
const breakPoint = 1440;

// Toggle Menu and Icons on Click
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('navbar--active');

    const icon = hamburger.querySelector('i, svg');

    if (icon) {
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark', 'fa-times');
        } else {
            icon.classList.remove('fa-xmark', 'fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Helper function to reset back to hamburger
function resetIconToBurger() {
    const icon = hamburger.querySelector('i, svg');
    if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark', 'fa-times');
    }
}

// Handle Window Resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= breakPoint) {
        navMenu.classList.remove('navbar--active');
        resetIconToBurger();
    }
});

// Close Menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideMenu && !isClickOnHamburger) {
        navMenu.classList.remove('navbar--active');
        resetIconToBurger();
    }
});
