// LIFF init
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    const lineId = profile.userId; 
    localStorage.setItem("lineId", lineId); 
  }
});

// เมื่อกดปุ่มชำระเงิน
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    // ส่ง Line ID ไป Make
    const lineId = localStorage.getItem("lineId");

    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_checkout", lineId })
    });

    const data = await res.json();
    console.log("Response from Make:", data);

    if (data.checkout_url) {
      // ✅ เปิดลิงก์ Stripe Checkout ทันที
      liff.openWindow({
        url: data.checkout_url,
        external: true
      });
    } else {
      alert("❌ ไม่พบ checkout_url จากเซิร์ฟเวอร์");
      document.getElementById("overlay").style.display = "none";
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่");
    document.getElementById("overlay").style.display = "none";
  }
});
