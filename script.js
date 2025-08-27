async function main() {
  await liff.init({ liffId: "2007908663-5ZQOKd2G" }); // ✅ LIFF ID จริง

  const overlay = document.getElementById("overlay");
  overlay.style.display = "none"; // ซ่อนไว้ก่อน

  document.getElementById("payBtn").addEventListener("click", async () => {
    overlay.style.display = "flex"; // โชว์ overlay ตอนกดปุ่ม

    try {
      // ✅ ดึง Line Profile
      const profile = await liff.getProfile();

      // ✅ ส่งข้อมูลไปยัง Make
      const response = await fetch("https://hook.eu2.make.com/gqucrevsxa9jhufojln0a08q88djdla4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_checkout",
          lineId: profile.userId,
          displayName: profile.displayName
        })
      });

      const data = await response.json();
      if (data.checkout_url) {
        // ✅ เปิด Stripe checkout ภายนอก
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
