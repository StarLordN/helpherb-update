import { makeT, LANGS, langInfo } from "./i18n.js";
import { creditLimit, redemptionAmount, addMonths, reminderDates } from "./calc.js";
import { validateStep, validateInterest, PROVINCES, TYPES } from "./validate.js";
import { DEALS, dealById } from "./data.js";
import { load, save, clearAll } from "./store.js";

const app = document.getElementById("app");
const tabsEl = document.getElementById("tabs");
const langBtn = document.getElementById("lang");
const brandEl = document.getElementById("brand");
const demoEl = document.getElementById("demo");

const S = {
  lang: load("lang", "th"),
  verified: load("investorVerified", false),
  requests: load("requests", []),
  interests: load("interests", []),
  calcForm: null,
  calcError: null,
  apply: freshApply(),
  investDone: null,
};
let t = makeT(S.lang);

const ERR = {
  rate_cap: "err_rate_cap", rate: "err_rate_cap", term: "err_term",
  appraisal: "err_appraisal", principal: "err_appraisal", ratio: "err_ratio", fee: "err_required",
};

function freshApply() {
  return { step: 1, draft: { consent: false }, errors: {}, done: null };
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
const locale = () => langInfo(S.lang).locale;
const money = (n) => `${Number(n).toLocaleString(locale())} ${t("baht")}`;
const pct = (n) => `${Number(n) * 100}%`;
function dateText(iso) {
  return new Intl.DateTimeFormat(locale(), { timeZone: "UTC", dateStyle: "long" })
    .format(new Date(iso + "T00:00:00Z"));
}
const typeLabel = (k) => t({ house: "typeHouse", land: "typeLand", condo: "typeCondo" }[k] || "typeHouse");
const statusLabel = () => t("status_new");
const errText = (code) => t(code || "err_required");
const list = (key) => {
  const v = t(key);
  return Array.isArray(v) ? v : [];
};
const row = (k, v) => `<div class="row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`;

function current() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [page, ...rest] = raw.split("/");
  return { page: page || "home", arg: rest.length ? decodeURIComponent(rest.join("/")) : null };
}

function calcResult(f) {
  const appraisal = Number(f.appraisal);
  const ratio = Number(f.ratio) / 100;
  const limit = creditLimit(appraisal, ratio); // throws CalcError
  const r = redemptionAmount({
    principal: limit,
    annualRatePct: Number(f.rate),
    termMonths: Math.trunc(Number(f.months)),
    feeAmount: Number(f.fee) || 0,
  });
  const today = new Date().toISOString().slice(0, 10);
  const deadline = addMonths(today, r.termMonths);
  return { ...r, limit, deadline, reminders: reminderDates(deadline) };
}

// ---------- pages ----------
function pageHome() {
  return `
    <section class="hero"><h1>${esc(t("homeTitle"))}</h1><p class="lede">${esc(t("homeLede"))}</p></section>
    <div class="cards">
      <a class="card" href="#/apply"><h2>${esc(t("homeOwner"))}</h2><p>${esc(t("homeOwnerDesc"))}</p></a>
      <a class="card alt" href="#/deals"><h2>${esc(t("homeInvestor"))}</h2><p>${esc(t("homeInvestorDesc"))}</p></a>
    </div>
    <div class="links">
      <a href="#/khai-fak">${esc(t("svcTitle"))}</a>
      <a href="#/learn">${esc(t("footerLearn"))}</a>
      <a href="#/faq">${esc(t("faqTitle"))}</a>
      <a href="#/contact">${esc(t("contactTitle"))}</a>
    </div>`;
}

function pageService() {
  return `
    <h1>${esc(t("svcTitle"))}</h1>
    <p class="lede">${esc(t("svcLede"))}</p>
    <p class="note">${esc(t("svcOwner"))}</p>
    <div class="panel">
      <h2>${esc(t("svcTermsTitle"))}</h2>
      <p>${esc(t("svcRate"))}</p>
      <p>${esc(t("svcLimit"))}</p>
      <p>${esc(t("svcTerm"))}</p>
      <p>${esc(t("svcFee"))}</p>
    </div>
    <h2>${esc(t("svcByType"))}</h2>
    <div class="chips">${TYPES.map((k) => `<a class="chip" href="#/khai-fak/${k}">${esc(typeLabel(k))}</a>`).join("")}</div>
    <h2>${esc(t("svcByProvince"))}</h2>
    <div class="chips">${PROVINCES.map((p) => `<a class="chip" href="#/khai-fak/${encodeURIComponent(p)}">${esc(p)}</a>`).join("")}</div>
    <div class="actions"><a class="btn" href="#/khai-fak/steps">${esc(t("svcSteps"))}</a>
      <a class="btn ghost" href="#/tools">${esc(t("toolsLink"))}</a></div>`;
}

function pageType(type) {
  return `
    <h1>${esc(t("svcTitle"))} · ${esc(typeLabel(type))}</h1>
    <p class="lede">${esc(t("typeLede"))}</p>
    <div class="actions"><button class="btn" type="button" data-action="prefill-type" data-type="${esc(type)}">${esc(t("applyTitle"))}</button>
      <a class="btn ghost" href="#/khai-fak">${esc(t("backHome"))}</a></div>`;
}

function pageProvince(p) {
  return `
    <h1>${esc(t("svcTitle"))} · ${esc(p)}</h1>
    <p class="lede">${esc(t("provinceLede"))}</p>
    <div class="actions"><button class="btn" type="button" data-action="prefill-province" data-province="${esc(p)}">${esc(t("applyTitle"))}</button>
      <a class="btn ghost" href="#/khai-fak">${esc(t("backHome"))}</a></div>`;
}

function pageSteps() {
  return `
    <h1>${esc(t("stepsTitle"))}</h1>
    <ol class="numbered">${list("steps").map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <div class="actions"><a class="btn" href="#/apply">${esc(t("navApply"))}</a></div>`;
}

function pageFaq() {
  return `
    <h1>${esc(t("faqTitle"))}</h1>
    <div class="list">
      ${list("faq").map(([q, a]) => `<div class="panel"><h2>${esc(q)}</h2><p>${esc(a)}</p></div>`).join("")}
    </div>`;
}

function pageContact() {
  return `<h1>${esc(t("contactTitle"))}</h1><p>${esc(t("contactText"))}</p>`;
}

function pageJamnong() {
  return `<h1>${esc(t("jamnongTitle"))}</h1><p class="note">${esc(t("jamnongText"))}</p>`;
}

function pageDownloads() {
  return `<h1>${esc(t("downloadsTitle"))}</h1><p class="note">${esc(t("downloadsText"))}</p>`;
}

function pageLearnIndex() {
  return `
    <h1>${esc(t("learnTitle"))}</h1>
    <p class="note">${esc(t("learnIndexLede"))}</p>
    <div class="list">
      <a class="card" href="#/learn/what-is-redemption"><h2>${esc(t("articleTitle"))}</h2></a>
      <a class="card" href="#/learn/downloads"><h2>${esc(t("downloadsTitle"))}</h2></a>
    </div>`;
}

function pageArticle() {
  return `
    <h1>${esc(t("articleTitle"))}</h1>
    ${list("articleBody").map((p) => `<p>${esc(p)}</p>`).join("")}
    <div class="actions"><a class="btn ghost" href="#/learn">${esc(t("learnTitle"))}</a></div>`;
}

function pageLp(campaign) {
  return `
    <section class="hero"><h1>${esc(t("lpTitle"))}</h1><p class="lede">${esc(t("lpBody"))}</p></section>
    <div class="actions"><a class="btn" href="#/apply">${esc(t("lpCta"))}</a></div>
    <p class="note">${esc(campaign || "")}</p>`;
}

function pageInvestor() {
  if (!S.verified) return pageDeals();
  const items = S.interests.length
    ? S.interests.map((i) => `<li><strong>${esc(i.id)}</strong> · ${esc(i.dealId || "-")} · ${esc(money(i.amount))}</li>`).join("")
    : `<li>${esc(t("investorEmpty"))}</li>`;
  return `
    <h1>${esc(t("investorTitle"))}</h1>
    <ul class="plain">${items}</ul>
    <p class="note">${esc(t("investorDocs"))}</p>`;
}

function pageCalc() {
  const f = S.calcForm || { appraisal: "3000000", ratio: "70", rate: "12", months: "12", fee: "0" };
  let result = null;
  let err = S.calcError;
  if (!err) {
    try {
      result = calcResult(f);
    } catch (e) {
      err = errText(ERR[e.code]);
    }
  }
  return `
    <h1>${esc(t("calcTitle"))}</h1>
    <form id="calc-form" class="form" novalidate>
      <label>${esc(t("calcAppraisal"))}<input name="appraisal" type="number" inputmode="numeric" min="1" value="${esc(f.appraisal)}"></label>
      <label>${esc(t("calcRatio"))}<input name="ratio" type="number" inputmode="decimal" min="1" max="100" value="${esc(f.ratio)}"></label>
      <label>${esc(t("calcRate"))}<input name="rate" type="number" inputmode="decimal" min="0" max="15" step="0.01" value="${esc(f.rate)}"></label>
      <label>${esc(t("calcMonths"))}<input name="months" type="number" inputmode="numeric" min="12" max="120" value="${esc(f.months)}"></label>
      <label>${esc(t("calcFee"))}<input name="fee" type="number" inputmode="numeric" min="0" value="${esc(f.fee)}"></label>
      <button class="btn" type="submit">${esc(t("calcSubmit"))}</button>
    </form>
    ${err ? `<p class="error" role="alert">${esc(err)}</p>` : ""}
    ${result ? `
      <div class="panel">
        ${row(t("calcLimit"), money(result.limit))}
        ${row(t("calcPrincipal"), money(result.principal))}
        ${row(t("calcInterest"), money(result.interest))}
        ${row(t("calcFeeOut"), money(result.fee))}
        ${row(t("calcTotal"), money(result.total))}
        ${row(t("calcDeadline"), dateText(result.deadline))}
        <div class="row"><span>${esc(t("calcReminders"))}</span><strong>${result.reminders.map(dateText).map(esc).join(" · ")}</strong></div>
      </div>
      <p class="note">${esc(t("calcNote"))}</p>` : ""}`;
}

function collect(form) {
  const o = {};
  for (const [k, v] of new FormData(form)) o[k] = v;
  if (form.elements.consent) o.consent = form.elements.consent.checked;
  return o;
}

function applyFields(step, d, e) {
  const err = (k) => (e[k] ? `<span class="error">${esc(errText(e[k]))}</span>` : "");
  if (step === 1) {
    return `
      <label>${esc(t("applyType"))}
        <select name="type">
          <option value="">${esc(t("choose"))}</option>
          ${TYPES.map((k) => `<option value="${k}" ${d.type === k ? "selected" : ""}>${esc(typeLabel(k))}</option>`).join("")}
        </select>${err("type")}</label>
      <label>${esc(t("applyProvince"))}
        <select name="province">
          <option value="">${esc(t("choose"))}</option>
          ${PROVINCES.map((p) => `<option ${d.province === p ? "selected" : ""}>${esc(p)}</option>`).join("")}
        </select>${err("province")}</label>`;
  }
  if (step === 2) {
    const limit = Number(d.appraisal) > 0 ? creditLimit(Number(d.appraisal)) : null;
    return `
      <label>${esc(t("applyAppraisal"))}<input name="appraisal" type="number" inputmode="numeric" min="1" value="${esc(d.appraisal || "")}">${err("appraisal")}</label>
      <label>${esc(t("applyAmount"))}<input name="amount" type="number" inputmode="numeric" min="1" value="${esc(d.amount || "")}">${err("amount")}</label>
      ${limit ? `<p class="note">${esc(t("applyLimitHint", { v: limit.toLocaleString(locale()) }))}</p>` : ""}`;
  }
  if (step === 3) {
    return `
      <label>${esc(t("applyName"))}<input name="name" autocomplete="name" value="${esc(d.name || "")}">${err("name")}</label>
      <label>${esc(t("applyPhone"))}<input name="phone" type="tel" inputmode="tel" autocomplete="tel" value="${esc(d.phone || "")}">${err("phone")}</label>
      <label>${esc(t("applyLine"))}<input name="line" value="${esc(d.line || "")}"></label>`;
  }
  return `
    <div class="panel">
      ${row(t("applyType"), typeLabel(d.type))}
      ${row(t("applyProvince"), d.province || "")}
      ${row(t("applyAppraisal"), money(d.appraisal || 0))}
      ${row(t("applyAmount"), money(d.amount || 0))}
      ${row(t("applyName"), d.name || "")}
    </div>
    <label class="check"><input type="checkbox" name="consent" ${d.consent ? "checked" : ""}> ${esc(t("applyConsent"))}</label>${err("consent")}`;
}

function doneView(req) {
  return `
    <section class="done">
      <h1>${esc(t("applyDoneTitle"))}</h1>
      <p>${esc(t("applyDoneRef", { id: req.id }))}</p>
      <p class="note">${esc(t("applyDoneText"))}</p>
      <div class="actions">
        <a class="btn" href="#/account">${esc(t("navAccount"))}</a>
        <button class="btn ghost" type="button" data-action="apply-again">${esc(t("applyAgain"))}</button>
      </div>
    </section>`;
}

function pageApply() {
  const a = S.apply;
  if (a.done) return doneView(a.done);
  const isLast = a.step === 4;
  return `
    <h1>${esc(t("applyTitle"))}</h1>
    <p class="note">${esc(t("applyStep", { n: a.step }))}</p>
    <div class="progress"><span style="width:${a.step * 25}%"></span></div>
    <form id="apply-form" class="form" novalidate>
      ${applyFields(a.step, a.draft, a.errors)}
      <div class="actions">
        ${a.step > 1 ? `<button class="btn ghost" type="button" data-action="back">${esc(t("back"))}</button>` : ""}
        <button class="btn" type="submit">${esc(isLast ? t("submit") : t("next"))}</button>
      </div>
    </form>`;
}

function pageDeals() {
  if (!S.verified) {
    return `
      <h1>${esc(t("dealsTitle"))}</h1>
      <div class="panel"><p>${esc(t("dealsLock"))}</p>
        <a class="btn" href="#/account">${esc(t("dealsLockBtn"))}</a></div>`;
  }
  return `
    <h1>${esc(t("dealsTitle"))}</h1>
    <p class="note">${esc(t("dealNotGuaranteed"))}</p>
    <div class="list">
      ${DEALS.map((d) => `
        <a class="card" href="#/deals/${esc(d.id)}">
          <h2>${esc(d.province)} · ${esc(typeLabel(d.type))}</h2>
          <p>${esc(t("dealAmount"))}: ${esc(money(d.amount))}</p>
          <p>${esc(t("dealTerm"))}: ${esc(t("monthsUnit", { n: d.termMonths }))}</p>
        </a>`).join("")}
    </div>`;
}

function pageDeal(id) {
  if (!S.verified) return pageDeals();
  const d = dealById(id);
  if (!d) return `<p class="error">${esc(t("err_required"))}</p>`;
  return `
    <h1>${esc(d.province)} · ${esc(typeLabel(d.type))}</h1>
    <div class="panel">
      ${row(t("dealAmount"), money(d.amount))}
      ${row(t("dealLtv"), pct(d.ltv))}
      ${row(t("dealTerm"), t("monthsUnit", { n: d.termMonths }))}
      ${row(t("dealReturn"), `${d.expectedNetPct}%`)}
    </div>
    <p class="note">${esc(t("dealRisk"))}</p>
    <div class="actions"><a class="btn" href="#/invest/${esc(d.id)}">${esc(t("dealInterest"))}</a>
      <a class="btn ghost" href="#/deals">${esc(t("back"))}</a></div>`;
}

function pageInvest(dealId) {
  const deal = dealId ? dealById(dealId) : null;
  if (S.investDone) {
    return `<section class="done"><h1>${esc(t("investSaved"))}</h1>
      <p class="note">${esc(t("investText"))}</p>
      <div class="actions"><a class="btn" href="#/account">${esc(t("navAccount"))}</a></div></section>`;
  }
  return `
    <h1>${esc(t("investTitle"))}</h1>
    <p class="note">${esc(t("investText"))}</p>
    ${deal ? `<p class="note">${esc(deal.province)} · ${esc(typeLabel(deal.type))}</p>` : ""}
    <div class="panel risk"><h2>${esc(t("riskTitle"))}</h2><p>${esc(t("riskText"))}</p></div>
    <form id="invest-form" class="form" novalidate>
      <input type="hidden" name="dealId" value="${esc(deal ? deal.id : "")}">
      <label>${esc(t("investName"))}<input name="name" autocomplete="name"></label>
      <label>${esc(t("investEmail"))}<input name="email" type="email" autocomplete="email"></label>
      <label>${esc(t("investCountry"))}<input name="country"></label>
      <label>${esc(t("investAmount"))}<input name="amount" type="number" inputmode="numeric" min="1"></label>
      <button class="btn" type="submit">${esc(t("investSubmit"))}</button>
    </form>`;
}

function pageAccount() {
  const reqs = S.requests.length
    ? S.requests.map((r) => `<li><strong>${esc(r.id)}</strong> · ${esc(typeLabel(r.type))} · ${esc(money(r.amount))} · ${esc(statusLabel())}</li>`).join("")
    : `<li>${esc(t("none"))}</li>`;
  const ints = S.interests.length
    ? S.interests.map((i) => `<li><strong>${esc(i.id)}</strong> · ${esc(i.dealId || "-")} · ${esc(money(i.amount))} · ${esc(t("interestNew"))}</li>`).join("")
    : `<li>${esc(t("none"))}</li>`;
  return `
    <h1>${esc(t("accountTitle"))}</h1>
    <h2>${esc(t("myRequests"))}</h2><ul class="plain">${reqs}</ul>
    <h2>${esc(t("myInterests"))}</h2><ul class="plain">${ints}</ul>
    <div class="panel">
      <h2>${esc(t("verifyTitle"))}</h2>
      ${S.verified
        ? `<p>${esc(t("verified"))}</p>`
        : `<p class="note">${esc(t("verifyText"))}</p><button class="btn" type="button" data-action="verify">${esc(t("verifyBtn"))}</button>`}
    </div>
    <div class="actions">
      <a class="link" href="#/about">${esc(t("footerAbout"))}</a>
      <a class="link" href="#/learn">${esc(t("footerLearn"))}</a>
      <a class="link" href="#/contact">${esc(t("contactTitle"))}</a>
      <button class="btn ghost" type="button" data-action="reset">${esc(t("resetBtn"))}</button>
    </div>`;
}

function pageAbout() {
  return `<h1>${esc(t("aboutTitle"))}</h1><p>${esc(t("aboutText"))}</p>`;
}

// ---------- shell ----------
function tabItems() {
  const items = [
    ["home", "navHome", "#/"],
    ["calc", "navCalc", "#/calc"],
    ["apply", "navApply", "#/apply"],
  ];
  if (S.verified) items.push(["deals", "navInvest", "#/deals"]);
  items.push(["account", "navAccount", "#/account"]);
  return items;
}

function renderChrome(page) {
  brandEl.textContent = t("brand");
  demoEl.textContent = t("demo");
  const info = langInfo(S.lang);
  if (!langBtn.options.length) {
    langBtn.innerHTML = LANGS.map((l) => `<option value="${l.code}">${esc(l.label)}</option>`).join("");
  }
  langBtn.value = S.lang;
  document.documentElement.lang = info.code;
  document.documentElement.dir = info.dir;
  tabsEl.innerHTML = tabItems()
    .map(([key, label, href]) => {
      const active = (key === "home" && page === "home") || key === page;
      return `<a href="${href}" ${active ? 'aria-current="page"' : ""}>${esc(t(label))}</a>`;
    })
    .join("");
}

function render() {
  const { page, arg } = current();
  let html;
  if (page === "home") html = pageHome();
  else if (page === "calc" || page === "tools") html = pageCalc();
  else if (page === "apply") {
    html = arg === "done" && S.requests[0] ? doneView(S.requests[0]) : pageApply();
  } else if (page === "khai-fak") {
    if (!arg) html = pageService();
    else if (arg === "steps") html = pageSteps();
    else if (TYPES.includes(arg)) html = pageType(arg);
    else if (PROVINCES.includes(arg)) html = pageProvince(arg);
    else html = pageService();
  } else if (page === "deals") html = arg ? pageDeal(arg) : pageDeals();
  else if (page === "investor") html = pageInvestor();
  else if (page === "invest") html = pageInvest(arg);
  else if (page === "account") html = pageAccount();
  else if (page === "about") html = pageAbout();
  else if (page === "faq") html = pageFaq();
  else if (page === "contact") html = pageContact();
  else if (page === "jamnong") html = pageJamnong();
  else if (page === "learn") {
    if (arg === "downloads") html = pageDownloads();
    else if (arg === "what-is-redemption") html = pageArticle();
    else html = pageLearnIndex();
  } else if (page === "lp") html = pageLp(arg);
  else html = pageHome();

  app.innerHTML = html;
  document.body.classList.toggle("bare", page === "lp");
  renderChrome(page);
  document.title = t("brand");
}

// ---------- events ----------
function onSubmit(e) {
  const form = e.target;
  if (form.id === "calc-form") {
    e.preventDefault();
    S.calcForm = Object.fromEntries(new FormData(form));
    S.calcError = null;
    render();
  } else if (form.id === "apply-form") {
    e.preventDefault();
    applySubmit(form);
  } else if (form.id === "invest-form") {
    e.preventDefault();
    investSubmit(form);
  }
}

function applySubmit(form) {
  const a = S.apply;
  const data = { ...a.draft, ...collect(form) };
  a.draft = data;
  const errors = validateStep(a.step, data);
  a.errors = errors;
  if (Object.keys(errors).length) return render();
  if (a.step < 4) {
    a.step += 1;
    a.errors = {};
    return render();
  }
  const req = {
    id: "REQ-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    type: data.type,
    province: data.province,
    appraisal: Number(data.appraisal),
    amount: Number(data.amount),
    name: String(data.name).trim(),
    phone: String(data.phone).replace(/[\s-]/g, ""),
    line: String(data.line || "").trim(),
    status: "new",
  };
  S.requests.unshift(req);
  save("requests", S.requests);
  S.apply = { ...freshApply(), done: req };
  render();
}

function investSubmit(form) {
  const data = collect(form);
  const errors = validateInterest(data);
  if (Object.keys(errors).length) {
    const msg = Object.values(errors).map((k) => errText(k)).join(" · ");
    let box = form.querySelector(".error");
    if (!box) { box = document.createElement("p"); box.className = "error"; box.setAttribute("role", "alert"); form.prepend(box); }
    box.textContent = msg;
    return;
  }
  S.interests.unshift({
    id: "INT-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    dealId: data.dealId || null,
    name: String(data.name).trim(),
    email: String(data.email).trim(),
    country: String(data.country || "").trim(),
    amount: Number(data.amount),
  });
  save("interests", S.interests);
  S.investDone = true;
  render();
}

app.addEventListener("submit", onSubmit);

app.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === "back") {
    const form = document.getElementById("apply-form");
    if (form) S.apply.draft = { ...S.apply.draft, ...collect(form) };
    S.apply.step = Math.max(1, S.apply.step - 1);
    S.apply.errors = {};
    render();
  } else if (action === "apply-again") {
    S.apply = freshApply();
    render();
  } else if (action === "prefill-type" || action === "prefill-province") {
    S.apply = freshApply();
    if (action === "prefill-type") S.apply.draft.type = btn.dataset.type;
    else S.apply.draft.province = btn.dataset.province;
    location.hash = "#/apply";
  } else if (action === "verify") {
    S.verified = true;
    save("investorVerified", true);
    render();
  } else if (action === "reset") {
    clearAll();
    Object.assign(S, { verified: false, requests: [], interests: [], apply: freshApply(), calcForm: null, investDone: null });
    location.hash = "#/";
    render();
  }
});

langBtn.addEventListener("change", () => {
  S.lang = langInfo(langBtn.value).code;
  save("lang", S.lang);
  t = makeT(S.lang);
  render();
});

window.addEventListener("hashchange", () => {
  if (current().page !== "invest") S.investDone = null;
  window.scrollTo(0, 0);
  render();
});

render();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
