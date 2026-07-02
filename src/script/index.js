import { travelData } from './data';

// DOM Element Selectors
const hamburger = document.querySelector('.navbar__hamburger');
const navMenu = document.querySelector('.navbar__menu');
const BREAKPOINT = 1440; // Breakpoint for md screen

// Toggle Menu and Icons on Click
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('navbar__menu--active');

    const icon = hamburger.querySelector('i, svg');

    if (icon) {
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark', 'fa-times'); // Two classes for the fallback if one is not working
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
    // Automatically close the mobile menu if the screen expands past the breakpoint
    if (window.innerWidth >= BREAKPOINT) {
        navMenu.classList.remove('navbar__menu--active');
        resetIconToBurger();
    }
});

// Close Menu when clicking outside
document.addEventListener('click', (e) => {
    // Check if the click target is within the navigation elements
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    // Close the menu if the user clicks anywhere else on the screen
    if (!isClickInsideMenu && !isClickOnHamburger) {
        navMenu.classList.remove('navbar__menu--active');
        resetIconToBurger();
    }
});

// Dynamically creating card and inserting into cards container
const cardsContainer = document.querySelector('.travel-cards');

travelData.forEach((item) => {
    cardsContainer.innerHTML += `
    <div class='travel-card'>
        <h2>${item.number}</h2>
        <p>${item.title}</p>
    </div>`;
});
