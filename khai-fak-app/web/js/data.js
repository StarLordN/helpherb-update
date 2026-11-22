// Sample data only. These are not real properties and not real offers.
export const DEALS = [
  { id: "D-001", province: "นนทบุรี", type: "house", appraisal: 4000000, ltv: 0.7, amount: 2500000, termMonths: 12, expectedNetPct: 9 },
  { id: "D-002", province: "ชลบุรี", type: "land", appraisal: 6000000, ltv: 0.6, amount: 3000000, termMonths: 24, expectedNetPct: 8 },
  { id: "D-003", province: "เชียงใหม่", type: "condo", appraisal: 2500000, ltv: 0.7, amount: 1500000, termMonths: 12, expectedNetPct: 9.5 },
];

export function dealById(id) {
  return DEALS.find((d) => d.id === id) || null;
}
