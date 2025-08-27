async function main() {
  await liff.init({ liffId: "2007908663-5ZQOKd2G" }); // ใช้ LIFF จริง

  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";

  document.getElementById("payBtn").addEventListener("click", async () => {
    overlay.style.display = "flex";
    try {
      const response = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_checkout" })
      });

      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        overlay.innerHTML = "❌ ไม่พบลิงก์ชำระเงิน";
      }
    } catch (err) {
      console.error(err);
      overlay.innerHTML = "⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่";
    }
  });
}
main();
