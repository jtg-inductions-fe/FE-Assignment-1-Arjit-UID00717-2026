import { travelData } from '../MOCK_DATA/card-data';
import splide from './carousel';
import './special-deals';
// DOM Element Selectors
const hamburger = document.querySelector('.navbar__hamburger');
const navMenu = document.querySelector('.navbar__menu');
const BREAKPOINT = 1440; // Breakpoint for md screen

// Toggle Menu and Icons on Click
hamburger.addEventListener('click', () => {
    // Toggle the mobile and tablet navigation menu visibility
    navMenu.classList.toggle('navbar__menu--active');

    // Shift focus to the opened menu on small screens
    if (
        navMenu.classList.contains('navbar__menu--active') &&
        window.innerWidth < BREAKPOINT
    ) {
        let a = document.querySelector('.navbar__menu--active');
        a.focus();
    }
    const icon = hamburger.querySelector('i, svg');

    // Switch between the 'hamburger' and 'close' icons depending on menu state
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
const cardsContainer = document.querySelector('.travel__cards');

// 1. Create an array of HTML strings and join them into one big string
const cardsHTML = travelData
    .map(
        (item) => `
    <div class='card'>
        <h2 class='card__heading' >${item.heading}</h2>
        <p class='card__para' >${item.para}</p>
    </div>`,
    )
    .join('');

// 2. Update the DOM a single time
cardsContainer.innerHTML = cardsHTML;

// Called the Mount to show carousel on UI
splide.mount();

// List of all suammaries
const summaries = document.querySelectorAll('.footer__summary');

// Adding click event to toggle the rotation of all mobile footer arrows.
summaries.forEach((summary) => {
    summary.addEventListener('click', () => {
        const icon = summary.querySelector('.up-arrow');
        icon.classList.toggle('footer__summary-arrow--rotate');
    });
});
