import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const hamburger = document.querySelector('.navbar__hamburger');
const navbarRight = document.querySelector('.navbar__right');

hamburger.addEventListener('click', () => {
    navbarRight.classList.toggle('navbar--active');
});

const travelData = [
    { number: '500+', title: 'Holiday Package' },
    { number: '100', title: 'Luxury Hotel' },
    { number: '7', title: 'Premium Airlines' },
    { number: '2k+', title: 'Happy Customer' },
];

const cardsContainer = document.querySelector('.travel-cards');

travelData.forEach((item) => {
    cardsContainer.innerHTML += `
    <div class='travel-card'>
        <h2>${item.number}</h2>
        <p>${item.title}</p>
    </div>`;
});

const reviewsData = [
    {
        name: 'Mark Smith',
        role: 'Travel Enthusiast',
        avatar: '/assets/user.jpg',
        rating: 5,
        text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.',
    },
    {
        name: 'Sarah Jenkins',
        role: 'Food Blogger',
        avatar: '/assets/user.jpg',
        rating: 5,
        text: 'Amazing user experience! The layout handles text beautifully and the navigation functions smoothly across mobile devices.',
    },
    {
        name: 'Alex Rivera',
        role: 'Photographer',
        avatar: '/assets/user.jpg',
        rating: 5,
        text: 'Highly recommended slider implementation. The clean separation of track layouts makes custom styling straightforward.',
    },
];

const sliderList = document.getElementById('dynamic-slider-list');

if (sliderList) {
    let finalHtml = '';

    reviewsData.forEach((user) => {
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

const summaries = document.querySelectorAll('.footer__mobile details summary');

summaries.forEach((summary) => {
    summary.addEventListener('click', () => {
        const icon = summary.querySelector('.up-arrow');
        icon.classList.toggle('rotate');
    });
});
