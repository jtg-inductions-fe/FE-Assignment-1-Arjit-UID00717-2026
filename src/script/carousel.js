import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { carouselData } from '../MOCK_DATA/carousel_data';

const sliderList = document.getElementById('dynamic-slider-list');

if (sliderList) {
    let finalHtml = '';

    carouselData.forEach((user) => {
        let stars = '';
        for (let i = 0; i < user.rating; i++) {
            stars += '<img src="/assets/star.svg" alt="star">';
        }

        finalHtml += `
            <li class="splide__slide carousel__item">
                <div class="card-avatar carousel__avatar-container">
                    <img src="${user.avatar}" alt="${user.name} class="carousel__avatar">
                </div>
                <div class="user-info carousel__info">
                    <h1 class="carousel__user-name">${user.name} <span class="carousel__user-role" >/ ${user.role}</span></h1>
                    <div class="user-rating carousel__rating">
                        ${stars}
                    </div>
                    <p class="carousel__feedback">${user.text}</p>
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

export default splide;
