


export const getDailyROIPctByPlan = (amountUSD) => {
   const a = Number(amountUSD);

  if (!Number.isFinite(a) || a <= 0) throw new Error("Invalid amount");
  if (a < 100) throw new Error("Minimum investment is $100");

  if (a <= 4999) return 0.67;
  if (a <= 24999) return 0.83;
  return 0.9;
};
