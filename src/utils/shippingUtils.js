/**
 * Utility functions for weight-based shipping calculation.
 */

export const cleanString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\s+/g, ' ').trim().toLowerCase();
};

export const isChennaiCity = (city) => {
  const cleanCity = cleanString(city);
  return cleanCity === 'chennai' || cleanCity === 'madras' || cleanCity === 'chennai city';
};

export const isTamilNaduState = (state) => {
  const cleanState = cleanString(state);
  return cleanState === 'tamil nadu' || cleanState === 'tamilnadu' || cleanState === 'tn';
};

/**
 * Calculates shipping charge based on total order weight and delivery destination.
 *
 * Rates:
 * - Chennai: ₹60 per kg
 * - Other Tamil Nadu districts: ₹80 per kg
 * - Other Indian states: ₹110 per kg
 *
 * @param {number} totalWeightInGrams - Total weight of items in grams
 * @param {string} state - Delivery state
 * @param {string} city - Delivery city
 * @returns {{ shippingCharge: number, chargeableWeightKg: number, shippingRatePerKg: number, shippingZone: string }}
 */
export const calculateShipping = (totalWeightInGrams, state, city) => {
  const chargeableWeightKg = Math.max(1, Math.ceil((totalWeightInGrams || 0) / 1000));
  
  if (!state || String(state).trim() === '') {
    return {
      shippingCharge: 0,
      chargeableWeightKg,
      shippingRatePerKg: 0,
      shippingZone: '',
    };
  }

  let shippingZone = 'Other States';
  let shippingRatePerKg = 110;

  if (isTamilNaduState(state)) {
    if (isChennaiCity(city)) {
      shippingZone = 'Chennai';
      shippingRatePerKg = 60;
    } else {
      shippingZone = 'Tamil Nadu';
      shippingRatePerKg = 80;
    }
  }

  const shippingCharge = chargeableWeightKg * shippingRatePerKg;

  return {
    shippingCharge,
    chargeableWeightKg,
    shippingRatePerKg,
    shippingZone,
  };
};
