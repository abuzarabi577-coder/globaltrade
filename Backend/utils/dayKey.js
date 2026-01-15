export const getDayKeyUTC = (d = new Date()) => d.toISOString().slice(0, 10);
export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
