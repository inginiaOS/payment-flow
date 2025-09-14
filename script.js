let lineId = null;

async function initLIFF() {
  try {
    await liff.init({ liffId: "2007908663-5ZQOKd2G" });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();
    lineId = profile.userId;
    localStorage.setItem("lineId", lineId);
    console.log("✅ LINE ID:", lineId);
  } catch (err) {
    console.error("❌ initLIFF error:", err);
  }
}

async function waitForLineId(timeout = 3000) {
  const start = Date.now();
  while (!lineId && Date.now() - start < timeout) {
    await new Promise(r => setTimeout(r, 300));
  }
  document.getElementById("pageLoader").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}

async function ensureLineId() {
  if (!lineId) {
    lineId = localStorage.getItem("lineId") || null;
  }
  if (!lineId) {
    try {
      const profile = await liff.getProfile();
      lineId = profile.userId;
      localStorage.setItem("lineId", lineId);
    } catch (err) {
      console.error("❌ ยังไม่ได้ LINE ID:", err);
    }
  }
  return lineId;
}

async function safePost(url, body = {}) {
  const id = await ensureLineId();
  if (!id) {
    alert("❌ ไม่พบ LINE ID กรุณาเปิดจาก LINE App แล้วลองใหม่");
    document.getElementById("overlay").style.display = "none";
    return null;
  }

  body.lineId = id;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

window.addEventListener("load", async () => {
  document.getElementById("pageLoader").style.display = "flex";
  document.getElementById("mainContent").style.display = "none";

  await initLIFF();
  await waitForLineId(3000);
});

// ---------------------------
// ปุ่มทั้งหมด
// ---------------------------

// ปุ่ม popup ล่าง
document.getElementById("payBtnBottom")?.addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  await new Promise(r => setTimeout(r, 1000)); // โหลด 1 วิ
  document.getElementById("overlay").style.display = "none";
  document.getElementById("paymentPopup").style.display = "flex";
});

document.getElementById("closePopup")?.addEventListener("click", () => {
  document.getElementById("paymentPopup").style.display = "none";
});

// PromptPay
document.getElementById("promptpayBtn")?.addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  try {
    const data = await safePost("https://hook.eu2.make.com/6yx7nzk71gxqh24tc6829gwmn7i75l2r");
    if (data && data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("❌ ไม่พบ checkout_url");
      document.getElementById("overlay").style.display = "none";
    }
  } catch (err) {
    console.error("PromptPay Error:", err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});

// บัตร 3 เดือน
document.getElementById("card3mBtn")?.addEventListener("click", async () => {
  document.getElementById("overlay").style.display = "flex";
  try {
    const data = await safePost("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
      plan: "3m_card",
    });
    if (data && data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("❌ ไม่พบ checkout_url");
      document.getElementById("overlay").style.display = "none";
    }
  } catch (err) {
    console.error("Card3m Error:", err);
    alert("❌ ไม่สามารถเริ่มการชำระเงินได้");
    document.getElementById("overlay").style.display = "none";
  }
});
