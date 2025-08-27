// ---------------------------
// script.js
// ---------------------------

// ตัวแปรเก็บ LINE ID
let lineId = null;

// 1. เริ่มต้น LIFF
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  // ถ้ายังไม่ได้ login → ให้ login ก่อน
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    try {
      // ดึงโปรไฟล์ LINE
      const profile = await liff.getProfile();
      lineId = profile.userId; // ✅ ได้ LINE User ID
      localStorage.setItem("lineId", lineId); // เก็บใน localStorage กันหาย
      console.log("LINE ID ที่ดึงมาได้:", lineId);
    } catch (err) {
      console.error("ไม่สามารถดึง LINE Profile ได้:", err);
    }
  }
});

// 2. ดักปุ่ม "สมัครตอนนี้"
document.getElementById("payBtn").addEventListener("click", async () => {
  // โชว์ Overlay loading
  document.getElementById("overlay").style.display = "flex";

  try {
    // ถ้า lineId ยังไม่มี ให้ลองดึงจาก localStorage
    if (!lineId) {
      lineId = localStorage.getItem("lineId") || null;
    }

    // 3. ยิงไปที่ Webhook ของ Make
    //    (Make จะใช้ค่า lineId ที่ส่งไปนี้ -> ใส่เข้า metadata ของ Stripe Session)
    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId })
    });

    // 4. รับ response กลับมาจาก Make (จะต้องมี checkout_url)
    const data = await res.json();

    if (data.checkout_url) {
      // ✅ Redirect ไปหน้าชำระเงิน Stripe
      window.location.href = data.checkout_url;
    } else {
      alert("❌ ไม่พบ checkout_url จาก webhook");
      document.getElementById("overlay").style.display = "none";
    }

  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});
