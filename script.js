// เริ่มต้น LIFF
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    const lineId = profile.userId; 
    localStorage.setItem("lineId", lineId); 
  }
});

// Stripe init
const stripe = Stripe("pk_test_51RwmOKEytqyqUsDq1TISRowwXfn2e4hwV9lGSyvcP4F6kv8tlMNnNUDNVT4MGcIFzYd3ffhWMNdalSuSXS30GzRM009oI1CvVr");

// ปุ่มจ่ายเงิน
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    const res = await fetch("/create-checkout-session", { method: "POST" });
    const session = await res.json();

    const lineId = localStorage.getItem("lineId");

    // ส่งข้อมูลไป Make
    await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkoutSessionId: session.id,
        lineId: lineId
      })
    });

    // ไปหน้า Stripe Checkout
    await stripe.redirectToCheckout({ sessionId: session.id });

  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});
