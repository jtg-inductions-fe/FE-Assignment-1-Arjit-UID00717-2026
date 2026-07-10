import Splide from '@splidejs/splide';
import '@splidejs/splide/css/core';
import { carouselData } from '../MOCK_DATA/carousel-data';

// Target the DOM element that will act as the container for the slider items
const sliderList = document.getElementById('dynamic-slider-list');

if (sliderList) {
    let finalHtml = '';

    // Loop through mock data array to build HTML markup for each individual user testimonial
    carouselData.forEach((user) => {
        // Generate SVG star rating string dynamically based on the numeric user.rating value
        let stars = '';
        for (let i = 0; i < user.rating; i++) {
            stars += '<img src="/assets/star.svg" alt="star">';
        }

        // Build the HTML template for each slider item
        finalHtml += `
            <li class="splide__slide carousel__item">
                <div class="carousel__avatar-container">
                    <img src="${user.avatar}" alt="${user.name} class="carousel__avatar">
                </div>
                <div class="carousel__info">
                    <h1 class="carousel__user-name">${user.name} <span class="carousel__user-role" >/ ${user.role}</span></h1>
                    <div class="carousel__rating">
                        ${stars}
                    </div>
                    <p class="carousel__feedback">${user.text}</p>
                </div>
            </li>
        `;
    });

    // Add all the new HTML items into the slider list at once
    sliderList.innerHTML = finalHtml;
}

// Initialize Splide slider
const splide = new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    pagination: true,
    arrows: true,
    classes: {
        // Map custom CSS classes to override default Splide UI styling controls
        pagination: 'carousel__pagination',
        page: 'carousel__page',
    },
});

export default splide;
