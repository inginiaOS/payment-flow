// ---------------------------
// script.js
// ---------------------------

// 1. เริ่มต้น LIFF
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    try {
      // ✅ ดึงโปรไฟล์ทันทีที่เปิด LIFF
      const profile = await liff.getProfile();
      const lineId = profile.userId;

      // เก็บกันหาย (backup)
      localStorage.setItem("lineId", lineId);
      console.log("LINE ID ส่งเข้า Webhook:", lineId);

      // ✅ ส่งเข้า Webhook ของ Make โดยตรง (เก็บใน Data Store)
      await fetch("https://hook.eu2.make.com/xxxxxxxxxx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId })
      });

    } catch (err) {
      console.error("❌ ไม่สามารถดึง LINE Profile ได้:", err);
    }
  }
});

// 2. ดักปุ่ม "สมัครตอนนี้"
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    // ✅ แค่เรียก webhook เดิมที่สร้าง checkout session
    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    const data = await res.json();

    if (data.checkout_url) {
      window.location.href = data.checkout_url; // Redirect ไป Stripe Checkout
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
