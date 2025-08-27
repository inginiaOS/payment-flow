// เริ่มต้น LIFF
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    const lineId = profile.userId; // ✅ เก็บ Line ID
    localStorage.setItem("lineId", lineId);
  }
});

// ฟังก์ชันเปิด overlay loading
function showOverlay(msg = "⏳ กำลังเตรียมการชำระเงิน กรุณารอสักครู่...") {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.style.display = "flex";
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div>${msg}</div>
    `;
  }
}

// ฟังก์ชันซ่อน overlay
function hideOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.style.display = "none";
}

// เมื่อกดปุ่มสมัคร (ปุ่ม CTA ใน HTML)
document.querySelectorAll(".cta-pay").forEach(btn => {
  btn.addEventListener("click", async () => {
    showOverlay();

    try {
      const response = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_checkout",
          lineId: localStorage.getItem("lineId")
        })
      });

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url; // ✅ redirect ไป Stripe
      } else {
        showOverlay("❌ เกิดข้อผิดพลาด ไม่พบลิงก์ชำระเงิน");
      }
    } catch (err) {
      console.error("⚠️ Error:", err);
      showOverlay("⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่");
      setTimeout(hideOverlay, 3000);
    }
  });
});
