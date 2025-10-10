const getStripeInterval = (durationInDays) => {
  durationInDays = Number(durationInDays);

  switch (durationInDays) {
    case 30: // Monthly plan
      return { interval: "month", interval_count: 1 };
    case 120: // 120 days,
      return { interval: "month", interval_count: 4 };
    case 365: // Yearly plan
      return { interval: "year", interval_count: 1 };
    default:
      console.warn(`Unknown duration: ${durationInDays}. Default to monthly.`);
      return { interval: "month", interval_count: 1 };
  }
};

const convertPriceToCents = (price) => {
  return Math.round(Number(price) * 100);
};

module.exports = { convertPriceToCents, getStripeInterval };
