// ---------------------------
// script.js (Clean Version)
// ---------------------------

// 1. เริ่มต้น LIFF
let lineId = null;

async function initLIFF() {
  try {
    await liff.init({ liffId: "2007908663-5ZQOKd2G" });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();
    lineId = profile.userId;
    localStorage.setItem("lineId", lineId);
    console.log("✅ LINE ID ที่ดึงมาได้ทันที:", lineId);
  } catch (err) {
    console.error("❌ initLIFF error:", err);
  }
}

// ฟังก์ชันรอ lineId (สูงสุด 3 วิ) ถ้าไม่ได้ก็ปล่อยหน้า
async function waitForLineId(timeout = 3000) {
  const start = Date.now();
  while (!lineId && Date.now() - start < timeout) {
    await new Promise(r => setTimeout(r, 300));
  }
  // ✅ ปล่อยหน้าเสมอหลัง timeout
  document.getElementById("pageLoader").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  console.log("⏳ ปล่อยหน้าแล้ว, lineId =", lineId);
}

// 2. ฟังก์ชันกันตาย: ดึง lineId ให้ชัวร์
async function ensureLineId() {
  if (!lineId) {
    lineId = localStorage.getItem("lineId") || null;
  }

  if (!lineId) {
    try {
      const profile = await liff.getProfile();
      lineId = profile.userId;
      localStorage.setItem("lineId", lineId);
    } catch (err) {
      console.error("❌ ยังไม่ได้ LINE ID:", err);
    }
  }

  return lineId;
}

// 3. ฟังก์ชันกลาง → ยิง webhook โดยเช็ค lineId ก่อน
async function safePost(url, body = {}) {
  const id = await ensureLineId();
  if (!id) {
    alert("❌ ไม่พบ LINE ID กรุณาเปิดจาก LINE App แล้วลองใหม่");
    document.getElementById("overlay").style.display = "none";
    return null;
  }

  body.lineId = id;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}

// ---------------------------
// เริ่มทำงาน
// ---------------------------
window.addEventListener("load", async () => {
  document.getElementById("pageLoader").style.display = "flex"; // loader
  document.getElementById("mainContent").style.display = "none";

  await initLIFF();
  await waitForLineId(3000); // ⏳ รอสูงสุด 3 วิ
});

// ---------------------------
// ปุ่มทั้งหมด
// ---------------------------

// ปุ่ม "สมัครตอนนี้" → เปิด popup
document.querySelectorAll("#payBtnTop, #payBtnBottom").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("paymentPopup").style.display = "flex";
  });
});

// ปุ่มปิด popup
document.getElementById("closePopup")?.addEventListener("click", () => {
  document.getElementById("paymentPopup").style.display = "none";
});

// ---------------------------
// Email Validation → ปลดล็อกปุ่ม
// ---------------------------
const emailInput = document.getElementById("customerEmail");
const promptpayBtn = document.getElementById("promptpayBtn");
const card3mBtn = document.getElementById("card3mBtn");

emailInput?.addEventListener("input", () => {
  const valid = emailInput.value.includes("@");
  promptpayBtn.disabled = !valid;
  card3mBtn.disabled = !valid;
});

// ---------------------------
// ปุ่มชำระเงิน (ส่ง email ไปด้วย)
// ---------------------------

// PromptPay → overlay
promptpayBtn?.addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  try {
    const data = await safePost("https://hook.eu2.make.com/6yx7nzk71gxqh24tc6829gwmn7i75l2r", {
      email: emailInput.value
    });
    if (data && data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("❌ ไม่พบ checkout_url");
      document.getElementById("overlay").style.display = "none";
    }
  } catch (err) {
    console.error("PromptPay Error:", err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});

// บัตร 3 เดือน → overlay
card3mBtn?.addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  try {
    const data = await safePost("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      plan: "3m_card",
      email: emailInput.value
    });
    if (data && data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("❌ ไม่พบ checkout_url");
      document.getElementById("overlay").style.display = "none";
    }
  } catch (err) {
    console.error("Card3m Error:", err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});
