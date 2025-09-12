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
// ===== Popup Handling =====
const popup = document.getElementById("paymentPopup");
const openPopupBtn = document.getElementById("payBtnBottom");
const closePopupBtn = document.getElementById("closePopup");
const btnPromptPay = document.getElementById("btnPromptPay");
const btnStripe = document.getElementById("btnStripe");

// เปิด Popup
openPopupBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

// ปิด Popup
closePopupBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// คลิกนอกกรอบ -> ปิด popup
window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

// ปุ่ม PromptPay
btnPromptPay.addEventListener("click", () => {
  window.location.href = "https://yourdomain.com/promptpay"; 
  // 🔧 ใส่ลิงก์ PromptPay หรือ webhook ของ Make
});

// ปุ่ม Stripe (3 เดือน)
btnStripe.addEventListener("click", () => {
  window.location.href = "https://yourdomain.com/stripe-checkout"; 
  // 🔧 ใส่ลิงก์ Stripe Checkout 3 เดือน
});
