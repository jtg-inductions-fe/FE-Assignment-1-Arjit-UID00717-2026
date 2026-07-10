// API to fetch deals for wheel section
export const API_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

// Timing Constants
export const TIMING_CONSTANTS = {
    FALL_BACK_DAY: 7,
    DAY_IN_MS: 24 * 60 * 60 * 1000,
    REBUILD_WHEEL_DELAY: 2500,
    DEAL_WON_DELAY: 4000,
    COPY_TIME: 2000,
};

// Degree Constants
export const DEG_RANGE_MIN = 4999;
export const DEG_RANGE_MAX = 5000;

//Local storage name constant
export const LOCAL_STORAGE = {
    WON_DEAL_DATA: 'unlocked_deals_data',
};
