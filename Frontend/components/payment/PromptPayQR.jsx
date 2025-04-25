// components/PromptPayQR.js
export default function PromptPayQR({ 
    phone="", 
    amount=0 
}) {
  const qrUrl = `https://promptpay.io/${phone}/${amount}.png`;

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">PromptPay QR</h2>
      <img
        src={qrUrl}
        alt="PromptPay QR"
        className="w-64 h-auto rounded shadow"
      />
    </div>
  );
}
