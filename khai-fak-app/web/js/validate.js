import { creditLimit } from "./calc.js";

export const TYPES = ["house", "land", "condo"];
// Sample list only. Replace with the full list of provinces before launch.
export const PROVINCES = [
  "กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ",
  "นครราชสีมา", "เชียงใหม่", "ชลบุรี", "ภูเก็ต",
];

export function isThaiMobile(value) {
  return /^0[689]\d{8}$/.test(String(value).replace(/[\s-]/g, ""));
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}

// Returns { field: errorKey }. Empty object means the step is valid.
export function validateStep(step, d) {
  const e = {};
  if (step === 1) {
    if (!TYPES.includes(d.type)) e.type = "err_type";
    if (!PROVINCES.includes(d.province)) e.province = "err_required";
  }
  if (step === 2) {
    const appraisal = Number(d.appraisal);
    const amount = Number(d.amount);
    if (!(appraisal > 0)) e.appraisal = "err_appraisal";
    else if (!(amount > 0)) e.amount = "err_required";
    else if (amount > creditLimit(appraisal)) e.amount = "err_amount_over";
  }
  if (step === 3) {
    if (!d.name || String(d.name).trim().length < 2) e.name = "err_name";
    if (!isThaiMobile(d.phone || "")) e.phone = "err_phone";
  }
  if (step === 4) {
    if (d.consent !== true) e.consent = "err_consent";
  }
  return e;
}

export function validateInterest(d) {
  const e = {};
  if (!d.name || String(d.name).trim().length < 2) e.name = "err_name";
  if (!isEmail(d.email || "")) e.email = "err_email";
  if (!(Number(d.amount) > 0)) e.amount = "err_invest_amount";
  return e;
}
