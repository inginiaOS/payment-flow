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

// 2. ดักปุ่ม "สมัครตอนนี้"
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    // ถ้า lineId ยังว่าง → ลองดึงจาก localStorage
    if (!lineId) {
      lineId = localStorage.getItem("lineId") || null;
    }

    // ✅ ยิงไปที่ Webhook ของ Make พร้อมส่ง lineId
    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId })
    });

    const data = await res.json();

    if (data.checkout_url) {
      // ✅ Redirect ไปหน้าชำระเงิน Stripe
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
document.getElementById("payBtnBottom").addEventListener("click", () => {
  document.getElementById("payBtn").click();
});
// เปิด popup เมื่อกดปุ่มล่าง
document.getElementById("payBtnBottom").addEventListener("click", () => {
  document.getElementById("paymentPopup").style.display = "flex";
});

// ปิด popup
document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("paymentPopup").style.display = "none";
});

// PromptPay → ยิง webhook พร้อม lineId
document.getElementById("promptpayBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  try {
    await fetch("https://hook.eu2.make.com/6yx7nzk71gxqh24tc6829gwmn7i75l2r", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId })
    });
  } catch (err) {
    console.error("PromptPay Error:", err);
  }
});

// 3 เดือนบัตร → ใช้ flow เดิม
document.getElementById("card3mBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  try {
    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId, plan: "3m_card" })
    });
    const data = await res.json();
    if (data.checkout_url) window.location.href = data.checkout_url;
  } catch (err) {
    console.error("Card3m Error:", err);
  }
});
