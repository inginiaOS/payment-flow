// ===== เริ่มต้น LIFF =====
liff.init({ liffId: "2007908663-5ZQOKd2G" })
  .then(async () => {
    if (!liff.isLoggedIn()) {
      liff.login();
    } else {
      try {
        const profile = await liff.getProfile();
        const lineId = profile.userId;
        console.log("✅ LINE ID:", lineId);

        // เก็บไว้ใน localStorage (กันหายตอนเปลี่ยนหน้า)
        localStorage.setItem("lineId", lineId);
      } catch (err) {
        console.error("❌ ดึงโปรไฟล์ไม่สำเร็จ:", err);
      }
    }
  })
  .catch(err => console.error("❌ LIFF init error:", err));


// ===== Stripe Init =====
const stripe = Stripe("pk_test_51RwmOKEytqyqUsDq1TISRowwXfn2e4hwV9lGSyvcP4F6kv8tlMNnNUDNVT4MGcIFzYd3ffhWMNdalSuSXS30GzRM009oI1CvVr");


// ===== ปุ่มจ่ายเงิน =====
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    // 1. เรียก Make → สร้าง checkout session
    const res = await fetch("https://hook.eu2.make.com/xxxx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineId: localStorage.getItem("lineId") || null
      })
    });

    const data = await res.json();
    console.log("✅ Response จาก Make:", data);

    // 2. ถ้ามี checkout_url → redirect เลย
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      throw new Error("ไม่มี checkout_url กลับมา");
    }

  } catch (err) {
    console.error("❌ Checkout error:", err);
    alert("ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});
