// ---------------------------
// script.js
// ---------------------------

// 1. เริ่มต้น LIFF
let lineId = null;

liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    try {
      const profile = await liff.getProfile();
      lineId = profile.userId;
      localStorage.setItem("lineId", lineId); // backup กันหาย
      console.log("LINE ID ที่ดึงมาได้:", lineId);
    } catch (err) {
      console.error("❌ ไม่สามารถดึง LINE Profile ได้:", err);
    }
  }
});

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

// 3. ฟังก์ชันกลาง → ใช้ยิง webhook แต่เช็ค lineId ก่อน
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

// 4. ดักปุ่ม "สมัครตอนนี้" (flow เดิม)
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    const data = await safePost("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4");
    if (data && data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("❌ ไม่พบ checkout_url");
      document.getElementById("overlay").style.display = "none";
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});

// เปิด popup เมื่อกดปุ่มล่าง
document.getElementById("payBtnBottom").addEventListener("click", () => {
  document.getElementById("paymentPopup").style.display = "flex";
});

// ปิด popup
document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("paymentPopup").style.display = "none";
});

// PromptPay → webhook ใหม่
document.getElementById("promptpayBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  try {
    const data = await safePost("https://hook.eu2.make.com/6yx7nzk71gxqh24tc6829gwmn7i75l2r");
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

// 3 เดือนบัตร → ใช้ flow เดิม
document.getElementById("card3mBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  try {
    const data = await safePost("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      plan: "3m_card",
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
