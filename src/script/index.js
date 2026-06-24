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
