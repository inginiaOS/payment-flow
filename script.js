// เริ่ม Stripe
const stripe = Stripe("pk_test_51RwmOKEytqyqUsDq1TISRowwXfn2e4hwV9lGSyvcP4F6kv8tlMNnNUDNVT4MGcIFzYd3ffhWMNdalSuSXS30GzRM009oI1CvVr");

// ปุ่มชำระเงิน
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    // ดึง Line ID (เก็บจาก liff ก่อนหน้านี้)
    const lineId = localStorage.getItem("lineId");

    // เรียก Make เพื่อสร้าง Checkout Session
    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId })
    });

    const data = await res.json();
    console.log("Response from Make:", data); // ✅ Debug ดูว่ามี data.id จริงไหม

    // ตรวจสอบว่ามี sessionId กลับมาจริงไหม
    if (!data.id) {
      throw new Error("⚠️ ไม่พบ sessionId จาก Make");
    }

    // Redirect ไป Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId: data.id });

    if (result.error) {
      console.error(result.error);
      alert("❌ เกิดข้อผิดพลาด: " + result.error.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});
