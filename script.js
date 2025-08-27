// 1. เริ่มต้น LIFF
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(() => {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
});

// 2. ดักปุ่ม "สมัครตอนนี้"
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    // ✅ ดึง lineId แบบสดๆ ตอนกดปุ่ม
    const profile = await liff.getProfile();
    lineId = profile.userId || "unknown";

    // backup เก็บ localStorage กันพลาด
    localStorage.setItem("lineId", lineId);
    console.log("ส่ง LINE ID:", lineId);

    // ✅ ยิงไปที่ Webhook ของ Make พร้อม lineId
    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId })
    });

    const data = await res.json();

    if (data.checkout_url) {
      window.location.href = data.checkout_url; // ✅ Redirect ไป Stripe Checkout
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
