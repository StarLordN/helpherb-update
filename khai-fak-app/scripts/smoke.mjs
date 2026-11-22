// Browser smoke test. Start the server first (npm start), then run: npm run smoke
// Uses the Playwright package that is installed in this environment.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:8080/";
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const problems = [];
page.on("pageerror", (e) => problems.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error") problems.push("console: " + m.text()); });

const expect = async (cond, msg) => { if (!cond) problems.push("FAILED: " + msg); };

await page.goto(BASE);
await expect(await page.getByText("ได้เงินจากทรัพย์ที่มีโฉนด").count() > 0, "home title");

// Calculator
await page.goto(BASE + "#/calc");
await page.getByRole("button", { name: "คำนวณ" }).click();
await expect(await page.getByText("ยอดไถ่รวม").count() > 0, "calculator result");

// Apply flow (4 steps) and save request
await page.goto(BASE + "#/apply");
await page.locator('select[name="type"]').selectOption("house");
await page.locator('select[name="province"]').selectOption("นนทบุรี");
await page.getByRole("button", { name: "ถัดไป" }).click();
await page.locator('input[name="appraisal"]').fill("3000000");
await page.locator('input[name="amount"]').fill("2000000");
await page.getByRole("button", { name: "ถัดไป" }).click();
await page.locator('input[name="name"]').fill("สมชาย ใจดี");
await page.locator('input[name="phone"]').fill("0812345678");
await page.getByRole("button", { name: "ถัดไป" }).click();
await page.locator('input[name="consent"]').check();
await page.getByRole("button", { name: "ส่งคำขอ" }).click();
await expect(await page.getByText("รับคำขอแล้ว").count() > 0, "request accepted");

// Account shows the request; investor tab is hidden until verified
await page.goto(BASE + "#/account");
await expect(await page.getByText("REQ-").count() > 0, "request listed in account");
await expect(await page.locator("#tabs a", { hasText: "ลงทุน" }).count() === 0, "investor tab hidden before verification");

// Verify, then deals appear
await page.getByRole("button", { name: "จำลองการยืนยัน" }).click();
await page.goto(BASE + "#/deals");
await expect(await page.getByText("นนทบุรี").count() > 0, "deals visible after verification");

await page.screenshot({ path: process.env.SHOT || "smoke-deals.png" });
await browser.close();

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("smoke ok");
