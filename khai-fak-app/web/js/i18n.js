// UI strings for the prototype. Thai is the default. Both languages must define the same keys (checked by tests).
export const dict = {
  th: {
    brand: "ขายฝาก (ต้นแบบ)",
    demo: "ต้นแบบทดลอง ข้อมูลทั้งหมดเก็บอยู่ในเครื่องนี้เท่านั้น ไม่มีการส่งข้อมูลจริงหรือการชำระเงิน",
    navHome: "หน้าแรก", navCalc: "คำนวณ", navApply: "ขอประเมิน", navInvest: "ลงทุน", navAccount: "บัญชี",
    homeTitle: "ได้เงินจากทรัพย์ที่มีโฉนด",
    homeLede: "ประเมินวงเงินและดูเงื่อนไขก่อนให้ข้อมูลติดต่อ",
    homeOwner: "ต้องการเงินทุน", homeOwnerDesc: "คำนวณวงเงินและขอประเมินทรัพย์",
    homeInvestor: "ต้องการลงทุน", homeInvestorDesc: "ดูทรัพย์ที่เปิดรับทุน (ต้องยืนยันตัวตนนักลงทุนก่อน)",
    calcTitle: "คำนวณวงเงินและยอดไถ่",
    calcAppraisal: "ราคาประเมิน (บาท)", calcRatio: "สัดส่วนวงเงินต่อราคาประเมิน (%)",
    calcRate: "อัตราดอกเบี้ยต่อปี (%)", calcMonths: "ระยะเวลา (เดือน)", calcFee: "ค่าบริการ (บาท)",
    calcSubmit: "คำนวณ", calcLimit: "วงเงินโดยประมาณ", calcPrincipal: "เงินต้น", calcInterest: "ดอกเบี้ย",
    calcFeeOut: "ค่าบริการ", calcTotal: "ยอดไถ่รวม", calcDeadline: "วันครบกำหนดไถ่ (ตัวอย่าง)",
    calcReminders: "วันที่ควรแจ้งเตือนก่อนครบกำหนด", calcNote: "ตัวเลขนี้เป็นการประมาณเบื้องต้น ไม่ใช่ใบเสนอราคาอย่างเป็นทางการ",
    applyTitle: "ขอประเมินทรัพย์",
    applyStep: "ขั้นที่ {n} จาก 4",
    applyType: "ประเภททรัพย์", applyProvince: "จังหวัด",
    applyAppraisal: "ราคาประเมินโดยประมาณ (บาท)", applyAmount: "วงเงินที่ต้องการ (บาท)",
    applyLimitHint: "วงเงินสูงสุดโดยประมาณ {v} บาท",
    applyName: "ชื่อ-นามสกุล", applyPhone: "เบอร์โทรศัพท์", applyLine: "LINE ID (ไม่บังคับ)",
    applyConsent: "ยินยอมให้เก็บและใช้ข้อมูลส่วนบุคคลเพื่อการประเมินทรัพย์",
    applyReview: "ตรวจสอบข้อมูลก่อนส่ง",
    next: "ถัดไป", back: "ย้อนกลับ", submit: "ส่งคำขอ", choose: "เลือก",
    applyAgain: "ขอประเมินเพิ่ม",
    applyDoneTitle: "รับคำขอแล้ว (จำลอง)", applyDoneRef: "เลขอ้างอิง {id}",
    applyDoneText: "ในต้นแบบนี้ยังไม่ได้ส่งถึงทีมงานจริง ดูรายการได้ที่หน้าบัญชี",
    typeHouse: "บ้าน", typeLand: "ที่ดิน", typeCondo: "คอนโด",
    dealsTitle: "ทรัพย์ที่เปิดรับทุน (ตัวอย่าง)",
    dealsLock: "หน้านี้แสดงเฉพาะเมื่อยืนยันตัวตนนักลงทุนแล้ว",
    dealsLockBtn: "ไปที่บัญชีเพื่อยืนยัน",
    dealAmount: "วงเงินทรัพย์", dealLtv: "สัดส่วนต่อราคาประเมิน", dealTerm: "ระยะสัญญา",
    dealReturn: "ผลตอบแทนคาดหมาย (ตัวอย่าง)",
    dealNotGuaranteed: "ไม่รับประกันผลตอบแทน ผลขึ้นกับผลของทรัพย์",
    dealInterest: "สนใจทรัพย์นี้",
    dealRisk: "หากไม่มีการไถ่ถอน บริษัทอาจขายทรัพย์ และผลที่ได้ขึ้นกับราคาขายจริง",
    investTitle: "สนใจลงทุน",
    investText: "ลงทะเบียนแสดงความสนใจ บริษัทจะติดต่อกลับเพื่อยืนยันตัวตนก่อนมีข้อตกลงรายบุคคล",
    investName: "ชื่อ-นามสกุล", investEmail: "อีเมล", investCountry: "ประเทศที่อยู่อาศัย",
    investAmount: "จำนวนเงินที่สนใจ (บาท)", investSubmit: "ลงทะเบียนความสนใจ",
    investSaved: "บันทึกความสนใจแล้ว (จำลอง)",
    riskTitle: "ความเสี่ยงที่ควรรู้",
    riskText: "กรรมสิทธิ์โอนให้บริษัทเมื่อจดทะเบียน นักลงทุนมีสิทธิเรียกเงินจากบริษัทเท่านั้น ไม่มีสิทธิในที่ดิน และอาจสูญเสียเงินลงทุนได้ทั้งหมด",
    accountTitle: "บัญชี", myRequests: "คำขอของฉัน", myInterests: "ความสนใจลงทุนของฉัน", none: "ยังไม่มีรายการ",
    verifyTitle: "ยืนยันตัวตนนักลงทุน",
    verifyText: "ขั้นนี้จำลองการยืนยันตัวตน ของจริงต้องมีเอกสารและการตรวจสอบโดยทีมงาน",
    verifyBtn: "จำลองการยืนยัน", verified: "ยืนยันแล้ว (จำลอง)",
    resetBtn: "ล้างข้อมูลในเครื่องนี้",
    aboutTitle: "เกี่ยวกับ",
    aboutText: "[ชื่อบริษัท] · [เลขทะเบียนนิติบุคคล] · [ที่ตั้ง] (ต้องใส่ข้อมูลจริงก่อนเผยแพร่)",
    learnTitle: "ความรู้", learnText: "หมวดนี้ยังไม่มีเนื้อหา",
    footerAbout: "เกี่ยวกับ", footerLearn: "ความรู้",
    status_new: "รอติดต่อ", interestNew: "รับความสนใจแล้ว",
    reqLabel: "เลขอ้างอิง", baht: "บาท", monthsUnit: "{n} เดือน",
    err_required: "กรุณากรอกข้อมูลนี้", err_type: "เลือกประเภททรัพย์",
    err_appraisal: "ราคาประเมินต้องมากกว่า 0", err_ratio: "สัดส่วนต้องอยู่ระหว่าง 1 ถึง 100",
    err_amount_over: "วงเงินเกินวงเงินโดยประมาณ", err_name: "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร",
    err_phone: "เบอร์โทรไม่ถูกต้อง (เช่น 0812345678)", err_consent: "ต้องยินยอมก่อนส่งคำขอ",
    err_email: "อีเมลไม่ถูกต้อง", err_invest_amount: "จำนวนเงินต้องมากกว่า 0",
    err_rate_cap: "อัตราดอกเบี้ยเกินเพดาน 15% ต่อปี", err_term: "ระยะเวลาต้องอยู่ระหว่าง 12 ถึง 120 เดือน",
  },
  en: {
    brand: "Redemption (prototype)",
    demo: "Prototype. All data stays on this device. No real data is sent and no payments are taken.",
    navHome: "Home", navCalc: "Calculate", navApply: "Apply", navInvest: "Invest", navAccount: "Account",
    homeTitle: "Get funds against your title deed",
    homeLede: "Estimate your limit and see the terms before sharing contact details.",
    homeOwner: "Need funding", homeOwnerDesc: "Calculate your limit and request an assessment",
    homeInvestor: "Want to invest", homeInvestorDesc: "View properties open for funding (identity verification first)",
    calcTitle: "Limit and redemption amount",
    calcAppraisal: "Appraisal price (THB)", calcRatio: "Limit as % of appraisal",
    calcRate: "Annual interest (%)", calcMonths: "Term (months)", calcFee: "Service fee (THB)",
    calcSubmit: "Calculate", calcLimit: "Estimated limit", calcPrincipal: "Principal", calcInterest: "Interest",
    calcFeeOut: "Service fee", calcTotal: "Total to redeem", calcDeadline: "Redemption deadline (example)",
    calcReminders: "Suggested reminder dates before the deadline", calcNote: "This is a rough estimate, not an official quote.",
    applyTitle: "Request a property assessment",
    applyStep: "Step {n} of 4",
    applyType: "Property type", applyProvince: "Province",
    applyAppraisal: "Estimated appraisal price (THB)", applyAmount: "Amount needed (THB)",
    applyLimitHint: "Estimated maximum limit: {v} THB",
    applyName: "Full name", applyPhone: "Phone number", applyLine: "LINE ID (optional)",
    applyConsent: "I consent to the collection and use of my personal data for the property assessment",
    applyReview: "Check your details before sending",
    next: "Next", back: "Back", submit: "Send request", choose: "Choose",
    applyAgain: "Request another assessment",
    applyDoneTitle: "Request received (simulated)", applyDoneRef: "Reference {id}",
    applyDoneText: "In this prototype nothing is sent to the real team. See your list on the Account page.",
    typeHouse: "House", typeLand: "Land", typeCondo: "Condo",
    dealsTitle: "Properties open for funding (examples)",
    dealsLock: "This page is shown only after investor identity verification.",
    dealsLockBtn: "Go to Account to verify",
    dealAmount: "Property amount", dealLtv: "Share of appraisal", dealTerm: "Contract term",
    dealReturn: "Expected return (example)",
    dealNotGuaranteed: "Returns are not guaranteed and depend on the outcome for the property.",
    dealInterest: "I am interested in this property",
    dealRisk: "If the owner does not redeem, the company may sell the property and the outcome depends on the actual sale price.",
    investTitle: "Register your interest",
    investText: "The company will contact you to verify your identity before any individual agreement is offered.",
    investName: "Full name", investEmail: "Email", investCountry: "Country of residence",
    investAmount: "Amount of interest (THB)", investSubmit: "Register interest",
    investSaved: "Interest recorded (simulated)",
    riskTitle: "Risks to understand",
    riskText: "Title passes to the company on registration. Investors have a contractual claim against the company only, not a right in the land, and may lose the entire investment.",
    accountTitle: "Account", myRequests: "My requests", myInterests: "My investment interests", none: "Nothing here yet",
    verifyTitle: "Investor identity verification",
    verifyText: "This step simulates verification. The real process needs documents and a manual check by the team.",
    verifyBtn: "Simulate verification", verified: "Verified (simulated)",
    resetBtn: "Clear data on this device",
    aboutTitle: "About",
    aboutText: "[Company name] · [Company registration number] · [Address] (insert real details before publishing)",
    learnTitle: "Knowledge", learnText: "No content in this section yet.",
    footerAbout: "About", footerLearn: "Knowledge",
    status_new: "Awaiting contact", interestNew: "Interest recorded",
    reqLabel: "Reference", baht: "THB", monthsUnit: "{n} months",
    err_required: "Please fill in this field", err_type: "Choose a property type",
    err_appraisal: "Appraisal price must be greater than 0", err_ratio: "Share must be between 1 and 100",
    err_amount_over: "Amount is above the estimated limit", err_name: "Enter a name of at least 2 characters",
    err_phone: "Invalid phone number (e.g. 0812345678)", err_consent: "You must consent before sending",
    err_email: "Invalid email address", err_invest_amount: "Amount must be greater than 0",
    err_rate_cap: "Interest rate is above the 15% per year cap", err_term: "Term must be between 12 and 120 months",
  },
};

import { copy, COPY_KEYS } from "./copy.js";
import lo from "./locales/lo.js";
import my from "./locales/my.js";
import zh from "./locales/zh.js";
import ja from "./locales/ja.js";
import ar from "./locales/ar.js";
import id from "./locales/id.js";

dict.th = { ...dict.th, ...copy.th };
dict.en = { ...dict.en, ...copy.en };
dict.lo = lo;
dict.my = my;
dict.zh = zh;
dict.ja = ja;
dict.ar = ar;
dict.id = id;

// Language list for the selector. Arabic is right-to-left.
export { COPY_KEYS };

// Languages without a translation of the extra pages fall back to English for those keys.
export const LANGS = [
  { code: "th", label: "ไทย", locale: "th-TH", dir: "ltr" },
  { code: "en", label: "English", locale: "en-US", dir: "ltr" },
  { code: "lo", label: "ລາວ", locale: "lo-LA", dir: "ltr" },
  { code: "my", label: "မြန်မာ", locale: "my-MM", dir: "ltr" },
  { code: "zh", label: "中文", locale: "zh-CN", dir: "ltr" },
  { code: "ja", label: "日本語", locale: "ja-JP", dir: "ltr" },
  { code: "ar", label: "العربية", locale: "ar", dir: "rtl" },
  { code: "id", label: "Bahasa Indonesia", locale: "id-ID", dir: "ltr" },
];

export function langInfo(code) {
  return LANGS.find((l) => l.code === code) || LANGS[0];
}

export function makeT(lang) {
  return function t(key, vars) {
    let s = (dict[lang] && dict[lang][key]) ?? dict.en[key] ?? key;
    if (vars) for (const k of Object.keys(vars)) s = s.replaceAll(`{${k}}`, String(vars[k]));
    return s;
  };
}
