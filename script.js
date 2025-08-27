let lineId = null;

// เริ่มต้น LIFF
liff.init({ liffId: "2007908663-5ZQOKd2G" }).then(async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    try {
      const profile = await liff.getProfile();
      lineId = profile.userId;
      localStorage.setItem("lineId", lineId); // ✅ เก็บใน localStorage
      console.log("LINE ID:", lineId);
    } catch (err) {
      console.error("ไม่สามารถดึง LINE Profile ได้:", err);
    }
  }
});

// เมื่อกดปุ่มจ่ายเงิน
document.getElementById("payBtn").addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";

  try {
    // ถ้า localStorage ยังว่าง → ดึงใหม่
    if (!lineId) {
      lineId = localStorage.getItem("lineId") || null;
    }

    const res = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId }) // ✅ ส่งไปแน่นอน
    });

    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
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
