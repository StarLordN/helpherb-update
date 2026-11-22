import { test } from "node:test";
import assert from "node:assert/strict";
import { creditLimit, redemptionAmount, addMonths, reminderDates, CalcError } from "../web/js/calc.js";

test("credit limit is ratio of appraisal, rounded down to 1,000 baht", () => {
  assert.equal(creditLimit(3000000), 2100000);
  assert.equal(creditLimit(1234567, 0.7), 864000);
});

test("credit limit rejects bad input", () => {
  assert.throws(() => creditLimit(0), (e) => e instanceof CalcError && e.code === "appraisal");
  assert.throws(() => creditLimit(1000, 0), (e) => e.code === "ratio");
  assert.throws(() => creditLimit(1000, 1.5), (e) => e.code === "ratio");
});

test("redemption amount is principal plus simple interest plus fee", () => {
  const r = redemptionAmount({ principal: 1000000, annualRatePct: 12, termMonths: 12, feeAmount: 5000 });
  assert.equal(r.interest, 120000);
  assert.equal(r.total, 1125000);
});

test("redemption amount enforces the 15% cap and the 12 to 120 month term", () => {
  assert.throws(() => redemptionAmount({ principal: 1, annualRatePct: 16, termMonths: 12 }), (e) => e.code === "rate_cap");
  assert.throws(() => redemptionAmount({ principal: 1, annualRatePct: 12, termMonths: 6 }), (e) => e.code === "term");
  assert.throws(() => redemptionAmount({ principal: 1, annualRatePct: 12, termMonths: 121 }), (e) => e.code === "term");
  assert.throws(() => redemptionAmount({ principal: 1, annualRatePct: 12, termMonths: 12.5 }), (e) => e.code === "term");
});

test("addMonths clamps the day to the end of the target month", () => {
  assert.equal(addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(addMonths("2024-01-31", 1), "2024-02-29");
  assert.equal(addMonths("2026-03-15", -6), "2025-09-15");
  assert.equal(addMonths("2026-12-31", 2), "2027-02-28");
});

test("reminder dates are 6 and 3 months before the deadline, earliest first", () => {
  assert.deepEqual(reminderDates("2027-03-15"), ["2026-09-15", "2026-12-15"]);
});
