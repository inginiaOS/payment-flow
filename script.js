// เริ่มต้น LIFF
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    const lineId = profile.userId;
    localStorage.setItem("lineId", lineId); // เก็บไว้ใช้ทีหลัง
  }
});

// เมื่อกดปุ่มจ่ายเงิน
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    const lineId = localStorage.getItem("lineId");

    // 🔗 ส่งไป Make เพื่อสร้าง Checkout Session
    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId })
    });

    const data = await res.json();
    console.log("Response from Make:", data);

    if (data.checkout_url) {
      window.location.href = data.checkout_url; // ✅ พาไป Stripe Checkout
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
