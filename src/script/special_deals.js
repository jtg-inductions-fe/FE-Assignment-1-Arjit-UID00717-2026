const wheel = document.querySelector('.special-deals__wheel');
const navSpecialLink = document.querySelector('.navbar__special-deals');
const specialDealsSection = document.querySelector('.special-deals');

let curDeg = 0;
const API_KEY =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';
let dealsData = [];
let randomIndex = [];

navSpecialLink.addEventListener('click', () => {
    const navMenu = document.querySelector('.navbar__menu');
    const hamburger = document.querySelector('.navbar__hamburger');

    specialDealsSection.style.display = 'block';
    document.querySelector('body').style.overflowY = 'hidden';
    navMenu.classList.remove('navbar__menu--active');
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

/**
 *It takes already stored deals won by user previously from local storage
 * @returns {array}
 */
function getWonDeals() {
    const won = localStorage.getItem('unlocked_deals_data');
    return won ? JSON.parse(won) : [];
}

/**
 * Description
 * @returns {array}
 */
function getWonDealLabels() {
    return getWonDeals().map((item) => item.label);
}

/**
 * changes the won deal count when use won new deal
 *
 */
function updateUnlockedCounter() {
    const counterBadge = document.querySelector('.special-deals__count');
    counterBadge.textContent = getWonDeals().length;
}

/**
 * Description
 * @param {string} label - name of deal
 */
function saveWonDeal(label) {
    if (label === 'No deals available') return;

    const wonDeals = getWonDeals();
    if (!wonDeals.some((item) => item.label === label)) {
        const totalDaysInMs = 12 * 24 * 60 * 60 * 1000;
        const expiryTimestamp = Date.now() + totalDaysInMs;

        wonDeals.push({
            label: label,
            expiresAt: expiryTimestamp,
        });

        localStorage.setItem('unlocked_deals_data', JSON.stringify(wonDeals));
    }
    updateUnlockedCounter();
}

/**
 * Fetch the data from API
 */
async function getData() {
    const rawData = await fetch(API_KEY);
    const data = await rawData.json();
    dealsData = [...data];

    updateUnlockedCounter();
    buildWheel();
    UnlockedDealsNavigation();
}
getData();

/**
 * It fills 4 section of wheel with random values from available data
 *
 */
function buildWheel() {
    randomIndex = [];
    const wonLabels = getWonDealLabels();

    const availableDeals = dealsData.filter(
        (item) => !wonLabels.includes(item.label),
    );

    const selectedDeals = [];
    while (selectedDeals.length < 4 && availableDeals.length > 0) {
        const randomIndexNum = Math.floor(
            Math.random() * availableDeals.length,
        );
        const dealItem = availableDeals.splice(randomIndexNum, 1)[0];
        selectedDeals.push(dealItem);
    }

    const labels = [];
    for (let i = 0; i < 4; i++) {
        if (selectedDeals[i]) {
            labels.push(selectedDeals[i].label);
            const masterIndex = dealsData.findIndex(
                (d) => d.label === selectedDeals[i].label,
            );
            randomIndex.push(masterIndex);
        } else {
            labels.push('No deals available');
            randomIndex.push(-1);
        }
    }

    const wheelHtml = `
        <button class="special-deals__spin-button">spin</button>
        <div class="special-deals__segment special-deals__segment-1">
            <span class="special-deals__segment-text1 special-deals__segment-text">${labels[0]}</span> 
        </div>
        <div class="special-deals__segment special-deals__segment-2">
            <span class="special-deals__segment-text2 special-deals__segment-text">${labels[1]}</span>
        </div>
        <div class="special-deals__segment special-deals__segment-3">
            <span class="special-deals__segment-text3 special-deals__segment-text">${labels[2]}</span>
        </div>
        <div class="special-deals__segment special-deals__segment-4">
            <span class="special-deals__segment-text4 special-deals__segment-text">${labels[3]}</span>
        </div>
    `;
    wheel.innerHTML = wheelHtml;

    attachSpinListener();
}

/**
 * It copies the coupon code when clicked on copy icon
 *
 */
function attachSpinListener() {
    let dealBtn = document.querySelector('.special-deals__spin-button');
    let resultContainer = document.querySelector('.special-deals__result');
    let couponTitle = document.querySelector('.special-deals__coupon-title');

    dealBtn.addEventListener('click', () => {
        buildWheel();

        resultContainer = document.querySelector('.special-deals__result');
        couponTitle = document.querySelector('.special-deals__coupon-title');
        dealBtn = document.querySelector('.special-deals__spin-button');

        dealBtn.disabled = true;
        dealBtn.style.cursor = 'not-allowed';
        resultContainer.style.display = 'none';

        const randomDeg = Math.ceil(Math.random() * 4999) + 5000;
        curDeg += randomDeg;
        wheel.style.transform = `rotate(${curDeg}deg)`;

        const actualDegrees = curDeg % 360;
        const pointerAngle = (360 - actualDegrees) % 360;
        const quadrant = Math.floor(pointerAngle / 90);

        const segmentMapping = [1, 3, 2, 0];
        const index = segmentMapping[quadrant];

        const masterIndex = randomIndex[index];
        const winningDeal = masterIndex !== -1 ? dealsData[masterIndex] : null;

        setTimeout(() => {
            dealBtn.disabled = false;
            dealBtn.style.cursor = 'pointer';

            if (winningDeal) {
                couponTitle.textContent = winningDeal.label;
                saveWonDeal(winningDeal.label);
                resultContainer.style.display = 'flex';
                UnlockedDealsNavigation();
            } else {
                resultContainer.style.display = 'none';
                couponTitle.textContent = '';
            }
        }, 4000);
    });
}

function copyCouponCode() {
    const copyBtns = document.querySelectorAll('.special-deals__copy-button');
    copyBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const codeContainer = e.target.closest(
                '.special-deals__coupon-action',
            );
            const code = codeContainer.querySelector(
                '.special-deals__coupon-code',
            ).textContent;
            navigator.clipboard.writeText(code);
        });
    });
}

/**
 * It list all the deals won by user
 *
 */
function UnlockedDealsNavigation() {
    let unlockedDealsBtn = document.querySelector(
        '.special-deals__view-button',
    );
    let wheelModal = document.querySelector('.special-deals__modal');
    let unlockedModel = document.querySelector('.special-deals__unlock-modal');
    const specialDeals = document.querySelector('.special-deals');
    const unlockedDealsList = document.querySelector(
        '.special-deals__list-container',
    );
    const goBackBtn = document.querySelector(
        '.special-deals__unlock-modal .special-deals__view-button',
    );
    unlockedDealsBtn.addEventListener('click', () => {
        wheelModal.style.display = 'none';
        unlockedModel.style.display = 'flex';
    });

    goBackBtn.addEventListener('click', () => {
        wheelModal.style.display = 'flex';
        unlockedModel.style.display = 'none';
    });

    if (!specialDeals) return;

    specialDeals.addEventListener('click', (e) => {
        if (e.target.closest('.special-deals__close')) {
            specialDeals.style.display = 'none';
        }
    });

    let listHtml = '';
    let won = getWonDeals();
    won.forEach((deal) => {
        const d = dealsData.find((d) => d.label === deal.label);

        // Calculate time configurations
        const msLeft = deal.expiresAt - Date.now();
        const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

        let expiryText = '';

        // Tracking rule changes: strict Day & Expired conditions
        if (msLeft <= 0) {
            expiryText = 'Expired';
        } else {
            expiryText = `Expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
        }
        listHtml += `
        <div class="special-deals__coupon coupon special-deals__list-coupon ${expiryText === 'Expired' ? 'special-deals__coupon-expired' : ''}">
                        <div class="special-deals__coupon-content">
                            <h6 class="special-deals__coupon-title">${d.label}</h6>
                            <span class="special-deals__coupon-expiry ${expiryText === 'Expired' ? 'special-deals__coupon-invalid' : ''}">${expiryText}</span>
                        </div>

                        <div class="special-deals__coupon-action">
                            <span class="special-deals__coupon-code ${expiryText === 'Expired' ? 'special-deals__coupon-inactive' : ''} ">${d.promoCode}</span>
                            <button class="special-deals__copy-button ${expiryText === 'Expired' ? 'special-deals__copy-button-disabled special-deals__coupon-inactive' : ''} ">
                                <i class="fa-regular fa-clone special-deals__copy-icon"></i>
                            </button>

                        </div>
                    </div>
        `;
    });
    unlockedDealsList.innerHTML = listHtml;
    copyCouponCode();
}

/**
 * Close the modal by clicking on close button
 */
function closeModal() {
    const specialDeals = document.querySelector('.special-deals');
    let wheelModal = document.querySelector('.special-deals__modal');
    let unlockedModel = document.querySelector('.special-deals__unlock-modal');

    specialDeals.addEventListener('click', (e) => {
        if (e.target.closest('.special-deals__close')) {
            wheelModal.style.display = 'flex';
            unlockedModel.style.display = 'none';
            specialDeals.style.display = 'none';
            document.querySelector('body').style.overflowY = 'scroll';
        }
    });
}

closeModal();
