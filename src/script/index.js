import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { travelData } from '../MOCK_DATA/card_data';
import { carouselData } from '../MOCK_DATA/carousel_data';

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

const sliderList = document.getElementById('dynamic-slider-list');

if (sliderList) {
    let finalHtml = '';

    carouselData.forEach((user) => {
        let stars = '';
        for (let i = 0; i < user.rating; i++) {
            stars += '<img src="/assets/star.svg" alt="star">';
        }

        finalHtml += `
            <li class="splide__slide">
                <div class="card-avatar">
                    <img src="${user.avatar}" alt="${user.name}">
                </div>
                <div class="user-info">
                    <h1>${user.name} <span>/ ${user.role}</span></h1>
                    <div class="user-rating">
                        ${stars}
                    </div>
                    <p class="rating-para">${user.text}</p>
                </div>
            </li>
        `;
    });

    sliderList.innerHTML = finalHtml;
}

// Initialize Splide slider
const splide = new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    pagination: true,
});

splide.mount();
