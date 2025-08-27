// เริ่มต้น LIFF
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    const lineId = profile.userId; // ✅ ได้ lineId
    localStorage.setItem("lineId", lineId); // เก็บไว้ใช้ตอน checkout
  }
});

// Stripe init
const stripe = Stripe("pk_test_51RwmOKEytqyqUsDq1TISRowwXfn2e4hwV9lGSyvcP4F6kv8tlMNnNUDNVT4MGcIFzYd3ffhWMNdalSuSXS30GzRM009oI1CvVr");

// เมื่อกดปุ่มจ่ายเงิน
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    // ดึง lineId ที่ได้จาก LIFF
    const lineId = localStorage.getItem("lineId");

    // ยิงตรงไปที่ Make webhook → ให้ Make สร้าง Checkout Session
    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId })
    });

    const data = await res.json();

    if (!data.id) {
      throw new Error("ไม่ได้รับ session.id จาก Make");
    }

    // Redirect ไป Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId: data.id });

    if (result.error) {
      throw result.error;
    }

  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});
