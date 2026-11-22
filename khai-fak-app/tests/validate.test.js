import { test } from "node:test";
import assert from "node:assert/strict";
import { isThaiMobile, isEmail, validateStep, validateInterest } from "../web/js/validate.js";
import { dict } from "../web/js/i18n.js";
import { DEALS } from "../web/js/data.js";

test("Thai mobile numbers are accepted with or without separators", () => {
  assert.equal(isThaiMobile("0812345678"), true);
  assert.equal(isThaiMobile("081-234-5678"), true);
  assert.equal(isThaiMobile("0212345678"), false);
  assert.equal(isThaiMobile("12345"), false);
});

test("email check", () => {
  assert.equal(isEmail("a@b.co"), true);
  assert.equal(isEmail("a@b"), false);
});

test("application steps validate their own fields", () => {
  assert.deepEqual(validateStep(1, { type: "house", province: "นนทบุรี" }), {});
  assert.equal(validateStep(1, { type: "boat", province: "นนทบุรี" }).type, "err_type");
  assert.equal(validateStep(2, { appraisal: 3000000, amount: 2000000 }).amount, undefined);
  assert.equal(validateStep(2, { appraisal: 3000000, amount: 2200000 }).amount, "err_amount_over");
  assert.equal(validateStep(3, { name: "ก", phone: "0812345678" }).name, "err_name");
  assert.equal(validateStep(3, { name: "สมชาย", phone: "123" }).phone, "err_phone");
  assert.equal(validateStep(4, { consent: false }).consent, "err_consent");
  assert.deepEqual(validateStep(4, { consent: true }), {});
});

test("investor interest form validates name, email and amount", () => {
  assert.deepEqual(validateInterest({ name: "Jane Doe", email: "jane@example.com", amount: 500000 }), {});
  assert.equal(validateInterest({ name: "J", email: "x", amount: 0 }).amount, "err_invest_amount");
});

test("both UI languages define the same keys", () => {
  assert.deepEqual(Object.keys(dict.en).sort(), Object.keys(dict.th).sort());
});

test("sample deals are internally consistent", () => {
  for (const d of DEALS) {
    assert.ok(d.amount > 0 && d.ltv > 0 && d.ltv <= 1, d.id);
    assert.ok(d.expectedNetPct <= 15, `${d.id} above cap`);
  }
});
