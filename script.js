async function main() {
  await liff.init({ liffId: "2007908663-5ZQOKd2G" }); // ✅ LIFF ID จริง

  const overlay = document.getElementById("overlay");
  overlay.style.display = "none"; // ❌ อย่าให้มันหมุนตั้งแต่แรก

  document.getElementById("payBtn").addEventListener("click", async () => {
    overlay.style.display = "flex"; // ✅ ให้แสดง overlay เฉพาะตอนกด

    try {
      const response = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", { // ✅ Webhook จริง
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_checkout" })
      });

      const data = await response.json();
      if (data.checkout_url) {
        // ✅ ใช้ LIFF redirect ไป Stripe โดยเปิดภายนอก
        liff.openWindow({
          url: data.checkout_url,
          external: true
        });
      } else {
        overlay.innerHTML = "❌ เกิดข้อผิดพลาด ไม่พบลิงก์ชำระเงิน";
      }
    } catch (err) {
      console.error(err);
      overlay.innerHTML = "⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่";
    }
  });
}
main();