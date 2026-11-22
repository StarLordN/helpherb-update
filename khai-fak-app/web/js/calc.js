// Pure calculation rules. No DOM access, so the same file is used by the browser and by tests.
// ASSUMPTIONS (confirm with a lawyer and the company before any real use):
// - LIMIT_RATIO_DEFAULT: share of appraisal offered as limit. Set from sample sites, not company policy.
// - MAX_ANNUAL_RATE_PCT: 15% per year cap, as reported by sources during research. Verify against the statute.
// - NOTICE_MONTHS: reminder window of 3 to 6 months before the deadline. Verify against the statute.

export const LIMIT_RATIO_DEFAULT = 0.7;
export const MAX_ANNUAL_RATE_PCT = 15;
export const TERM_MIN_MONTHS = 12;
export const TERM_MAX_MONTHS = 120;
export const NOTICE_MONTHS = [6, 3];

export class CalcError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

// Limit is rounded DOWN to the nearest 1,000 baht.
export function creditLimit(appraisal, ratio = LIMIT_RATIO_DEFAULT) {
  if (!(appraisal > 0)) throw new CalcError("appraisal");
  if (!(ratio > 0 && ratio <= 1)) throw new CalcError("ratio");
  return Math.floor((appraisal * ratio) / 1000) * 1000;
}

// Simple interest on principal for the full term. Fee is added as given.
export function redemptionAmount({ principal, annualRatePct, termMonths, feeAmount = 0 }) {
  if (!(principal > 0)) throw new CalcError("principal");
  if (!(annualRatePct >= 0 && annualRatePct <= MAX_ANNUAL_RATE_PCT)) {
    throw new CalcError(annualRatePct > MAX_ANNUAL_RATE_PCT ? "rate_cap" : "rate");
  }
  if (!Number.isInteger(termMonths) || termMonths < TERM_MIN_MONTHS || termMonths > TERM_MAX_MONTHS) {
    throw new CalcError("term");
  }
  if (!(feeAmount >= 0)) throw new CalcError("fee");
  const interest = Math.round(((principal * annualRatePct) / 100) * (termMonths / 12) * 100) / 100;
  const total = Math.round((principal + interest + feeAmount) * 100) / 100;
  return { principal, interest, fee: feeAmount, total, termMonths };
}

// Adds months to an ISO date (YYYY-MM-DD). Clamps the day to the end of the target month.
export function addMonths(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const total = y * 12 + (m - 1) + n;
  const ny = Math.floor(total / 12);
  const nm = total % 12;
  const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  const nd = Math.min(d, last);
  return `${ny}-${String(nm + 1).padStart(2, "0")}-${String(nd).padStart(2, "0")}`;
}

// Reminder dates, earliest first.
export function reminderDates(deadlineIso) {
  return NOTICE_MONTHS.map((m) => addMonths(deadlineIso, -m)).sort();
}
