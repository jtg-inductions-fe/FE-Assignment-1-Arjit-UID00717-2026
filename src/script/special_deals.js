import {
    API_KEY,
    FALL_BACK_DAY,
    DAY_IN_MS,
    DEG_RANGE_MIN,
    DEG_RANGE_MAX,
    REBUILD_WHEEL_DELAY,
    DEAL_WON_DELAY,
    COPY_TIME,
    WON_DEAL_DATA,
} from '../constants/common_constants';

const wheel = document.querySelector('.special-deals__wheel');
const navSpecialLink = document.querySelector('.navbar__special-deals');
const specialDealsSection = document.querySelector('.special-deals');
const loadingText = document.querySelector('.special-deals__loading-text');
const segmentWrapper = document.querySelector(
    '.special-deals__segment-wrapper',
);
const spinBtn = document.querySelector('.special-deals__spin-button');

const state = {
    curDeg: 0, // Current degree of wheel
    dealsData: [], // Stores the data fetched from API
    randomIndex: [], // Stores the actual index of deals showed in wheel
};

// Handle clicks on the special deals navigation link
navSpecialLink.addEventListener('click', () => {
    const resultContainer = document.querySelector('.special-deals__result');
    resultContainer.style.display = 'none';
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    wheel.style.transition = 'transform 4s ease-out';

    // Fetch the required data for the deals section
    getData();

    // Select the mobile menu drawer and hamburger button from the DOM
    const navMenu = document.querySelector('.navbar__menu');
    const hamburger = document.querySelector('.navbar__hamburger');

    // Make the special deals container visible to the user
    specialDealsSection.style.display = 'flex';
    document.querySelector('body').style.overflowY = 'hidden'; // Disable background page scrolling while the deals section is active
    navMenu.classList.remove('navbar__menu--active'); // Close the active hamburger
    const icon = hamburger.querySelector('i, svg'); // select the hamburger icon

    if (icon) {
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars'); // Replace the hamburger icon with the close icon
            icon.classList.add('fa-xmark', 'fa-times'); // Two classes for the fallback if one is not working
        } else {
            icon.classList.remove('fa-xmark', 'fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

/**
 * Retrieves all previously unlocked deals from localStorage.
 * @returns {Object[]} Array of unlocked deal objects.
 */
function getWonDeals() {
    const won = localStorage.getItem('unlocked_deals_data');
    return won ? JSON.parse(won) : []; // Return empty array if deals are not found in local storage
}

/**
 * Returns an array containing the labels of all previously unlocked deals.
 * @returns {String[]}
 */
function getWonDealLabels() {
    return getWonDeals().map((item) => item.label); // Get label of won deals only.
}

/**
 * Updates the unlocked deal counter shown on the Special Deals button.
 *
 */
function updateUnlockedCounter() {
    const counterBadge = document.querySelector('.special-deals__count');
    counterBadge.textContent = getWonDeals().length;
}

/**
 * Saves a newly won deal in localStorage if it has not already been unlocked.
 * @param {Object} deal - Won deal object returned from the wheel.
 */
function saveWonDeal(deal) {
    if (!deal || deal.label === 'No deals available') return;

    const wonDeals = getWonDeals();

    if (!wonDeals.some((item) => item.promoCode === deal.promoCode)) {
        const validDays = deal.validFor ?? FALL_BACK_DAY;
        const expiryTimestamp = Date.now() + validDays * DAY_IN_MS;

        wonDeals.push({
            label: deal.label,
            promoCode: deal.promoCode,
            validFor: deal.validFor,
            expiresAt: expiryTimestamp,
        });

        localStorage.setItem(WON_DEAL_DATA, JSON.stringify(wonDeals));
    }

    updateUnlockedCounter();
}

/**
 * Fetch the data from API
 */
async function getData() {
    loadingText.style.display = 'flex';
    segmentWrapper.style.visibility = 'hidden';
    spinBtn.style.display = 'none';
    // Fetch all available deals from the API
    const rawData = await fetch(API_KEY);
    const data = await rawData.json();

    state.dealsData = [...data];

    updateUnlockedCounter(); // Show the won deal count

    buildWheel(); // Build wheel with new deals came from API

    attachSpinListener(); // Enables spin when clicked on spin button
    unlockedDealsNavigation(); // To navigate from deals wheel section to won deals section
    loadingText.style.display = 'none';
    segmentWrapper.style.visibility = 'visible';
    spinBtn.style.display = 'block'; // Show spin button after loading
}

/**
 * Selects up to four random unlocked deals and displays them on the wheel.
 * Previously unlocked deals are excluded.
 */
function buildWheel() {
    state.randomIndex = [];
    const wonLabels = getWonDealLabels();
    // Remove deals that have already been unlocked by the user
    const availableDeals = state.dealsData.filter(
        (item) => !wonLabels.includes(item.label),
    );

    const selectedDeals = [];
    // Selecting random deals from available deals
    while (selectedDeals.length < 4 && availableDeals.length > 0) {
        const randomIndexNum = Math.floor(
            Math.random() * availableDeals.length,
        );
        // Remove the randomly selected deal so it cannot appear twice
        const dealItem = availableDeals.splice(randomIndexNum, 1)[0];
        selectedDeals.push(dealItem);
    }

    // Label which will show on wheel segments
    const labels = [];
    for (let i = 0; i < 4; i++) {
        if (selectedDeals[i]) {
            labels.push(selectedDeals[i].label);
            const masterIndex = state.dealsData.findIndex(
                (deal) => deal.label === selectedDeals[i].label,
            );
            state.randomIndex.push(masterIndex);
        } else {
            labels.push('No deals available');
            state.randomIndex.push(-1); // If no deal left push No deals available in the wheel label
        }
    }

    //Constructing wheel with 4 random deal labels
    const wheelSegmentText = document.querySelectorAll(
        '.special-deals__segment-text',
    );
    for (let i = 0; i < 4; i++) {
        wheelSegmentText[i].textContent = labels[i];
    }
}

/**
 * Attaches the spin functionality to the spin button and determines
 * the winning deal after the wheel animation completes.
 */
function attachSpinListener() {
    let dealBtn = document.querySelector('.special-deals__spin-button');

    dealBtn.addEventListener('click', () => {
        const resultContainer = document.querySelector(
            '.special-deals__result',
        );
        const couponTitle = document.querySelector(
            '#special-deals__coupon-title',
        );

        //when wheel started rotating disable button
        dealBtn.disabled = true;
        dealBtn.style.cursor = 'not-allowed';
        resultContainer.style.display = 'none'; // Previous result container should be hidden again

        // Calculates the winning deal and store that in winningDeal
        const winningDeal = calculateWinningDeal();
        // Wait 4 seconds for the spin animation to complete before showing results
        setTimeout(() => {
            // Re-enable the spin button for the next turn
            dealBtn.disabled = false;
            dealBtn.style.cursor = 'pointer';

            // Check if there is a valid winning prize
            if (winningDeal) {
                couponTitle.textContent = winningDeal.label; // Display prize name
                document.querySelector(
                    '#special-deals__coupon-code',
                ).textContent = winningDeal.promoCode;
                const couponExpiry = document.querySelector(
                    '#special-deals__coupon-expiry',
                );

                const validDays = winningDeal.validFor ?? FALL_BACK_DAY;

                couponExpiry.textContent = `Expires in ${validDays} day${validDays > 1 ? 's' : ''}`;
                saveWonDeal(winningDeal); // Save win data locally
                resultContainer.style.display = 'flex'; // Display the result container

                setTimeout(() => {
                    buildWheel();
                }, REBUILD_WHEEL_DELAY);
            } else {
                resultContainer.style.display = 'none'; // If the result is no deal found simply don't show the result container
                couponTitle.textContent = '';
            }
            unlockedDealsNavigation();
        }, DEAL_WON_DELAY);
    });
}

/**
 * To calculate the deal won by user
 */
function calculateWinningDeal() {
    const randomDeg = Math.ceil(Math.random() * DEG_RANGE_MIN) + DEG_RANGE_MAX; // Wheel will rotate between 5000 - 1000 deg
    state.curDeg += randomDeg; // It protects wheel from moving backward direction
    wheel.style.transform = `rotate(${state.curDeg}deg)`;

    const actualDegrees = state.curDeg % 360; //It only tell wheel's actual movement from initial position
    const pointerAngle = (360 - actualDegrees) % 360; // Map clockwise rotation to the fixed top pointer
    const quadrant = Math.floor(pointerAngle / 90); // Divide by segment width (90°) to get the quadrant index (0-3)

    // Convert the detected wheel quadrant to the corresponding
    // deal index based on the visual layout of the wheel.
    const segmentMapping = [1, 3, 2, 0];
    const index = segmentMapping[quadrant];

    // Get the actual deal index and fetch the winning item data
    const masterIndex = state.randomIndex[index];

    return masterIndex !== -1 ? state.dealsData[masterIndex] : null;
}

/**
 * Copies the coupon code to the clipboard and briefly shows
 * a success icon after copying.
 */
function copyCouponCode() {
    // Attach the listener once to document.body
    document.body.addEventListener('click', (e) => {
        // Check if the clicked target (or its parent) matches copy button
        const currentBtn = e.target.closest('#special-deals__copy-button');
        if (!currentBtn) return;

        const codeContainer = currentBtn.closest(
            '#special-deals__coupon-action',
        );
        // Extracting the coupon code
        const code = codeContainer.querySelector(
            '#special-deals__coupon-code',
        ).textContent;

        // Copy the text to clipboard
        navigator.clipboard.writeText(code);

        // Save the original button HTML
        const originalHTML = currentBtn.innerHTML;

        // Change button content to a Font Awesome check mark
        currentBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        currentBtn.disabled = true; // Prevent double clicks

        // Revert back to original state after 2 seconds
        setTimeout(() => {
            currentBtn.innerHTML = originalHTML;
            currentBtn.disabled = false;
        }, COPY_TIME);
    });
}

/**
 * Handles navigation between the spinning wheel and unlocked deals modal,
 * then renders all unlocked deals.
 */
function unlockedDealsNavigation() {
    const unlockedDealsBtn = document.querySelector(
        '.special-deals__view-button',
    );
    const wheelModal = document.querySelector('.special-deals__modal');
    const unlockedModal = document.querySelector(
        '.special-deals__unlock-modal',
    );
    const specialDeals = document.querySelector('.special-deals');
    const goBackBtn = document.querySelector(
        '.special-deals__unlock-modal .special-deals__view-button',
    );

    if (!specialDeals) return;

    // Toggle to unlocked views
    unlockedDealsBtn?.addEventListener('click', () => {
        wheelModal.style.display = 'none';
        unlockedModal.style.display = 'flex';
    });

    // Toggle back to wheel view
    goBackBtn?.addEventListener('click', () => {
        wheelModal.style.display = 'flex';
        unlockedModal.style.display = 'none';
    });

    // Sort and render list
    const sortedDeals = getSortedWonDeals();
    renderUnlockedDealsList(sortedDeals);
}

// Data Sorting
function getSortedWonDeals() {
    const won = getWonDeals();
    const now = Date.now();

    return won.sort((a, b) => {
        const aActive = a.expiresAt > now;
        const bActive = b.expiresAt > now;

        // Active deals take priority over expired ones
        if (aActive !== bActive) {
            return bActive - aActive;
        }
        // Latest expiry timestamp first
        return b.expiresAt - a.expiresAt;
    });
}

// 3. UI Component Renderer
function renderUnlockedDealsList(deals) {
    const unlockedDealsList = document.querySelector(
        '.special-deals__list-container',
    );
    if (!unlockedDealsList) return;

    let listHtml = '';
    const now = Date.now();

    deals.forEach((deal) => {
        const msLeft = deal.expiresAt - now;
        const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
        const isExpired = msLeft <= 0;
        const expiryText = isExpired
            ? 'Expired'
            : `Expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;

        // CSS Variant strings mapped out cleanly
        const expiredCardClass = isExpired
            ? 'special-deals__coupon-expired'
            : '';
        const invalidTextClass = isExpired
            ? 'special-deals__coupon-invalid'
            : '';
        const inactiveContentClass = isExpired
            ? 'special-deals__coupon-inactive'
            : '';
        const disabledBtnClass = isExpired
            ? 'special-deals__copy-button-disabled special-deals__coupon-inactive'
            : '';

        listHtml += `
            <div id="special-deals__coupon" class="coupon special-deals__list-coupon ${expiredCardClass}">
                <div id="special-deals__coupon-content" class="coupon-content">
                    <h6 id="special-deals__coupon-title" class="coupon-title">${deal.label}</h6>
                    <span id="special-deals__coupon-expiry" class="coupon-expiry ${invalidTextClass}">${expiryText}</span>
                </div>
                <div id="special-deals__coupon-action" class="coupon-action">
                    <span id="special-deals__coupon-code" class="coupon-code ${inactiveContentClass}">${deal.promoCode}</span>
                    <button id="special-deals__copy-button" class="coupon-button ${disabledBtnClass}">
                        <i class="fa-regular fa-clone special-deals__copy-icon"></i>
                    </button>
                </div>
            </div>
        `;
    });

    unlockedDealsList.innerHTML = listHtml;
    copyCouponCode(); // Initialize the dynamic copy handlers immediately after generation
}

/**
 * Close the modal by clicking on close button
 */
function closeModal() {
    const specialDeals = document.querySelector('.special-deals');
    const wheelModal = document.querySelector('.special-deals__modal');
    const unlockedModal = document.querySelector(
        '.special-deals__unlock-modal',
    );

    // It hides the special deals modal when user click on cross icon
    specialDeals.addEventListener('click', (e) => {
        if (e.target.closest('.special-deals__close-icon')) {
            wheelModal.style.display = 'flex';
            unlockedModal.style.display = 'none';
            specialDeals.style.display = 'none';
            const body = document.querySelector('body');
            body.style.overflowY = 'scroll';
        }
    });
}

closeModal();
