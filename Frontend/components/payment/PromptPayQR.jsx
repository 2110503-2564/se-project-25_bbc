// components/PromptPayQR.js
export default function PromptPayQR({ 
    phone="", 
    amount=0 ,
    size=100
}) {
  const qrUrl = `https://promptpay.io/${phone}/${amount}.png`;

  return (
    <div style={{flexShrink:"0"}} className="text-center">
      <img
        src={qrUrl}
        alt="PromptPay QR"
        style={{width:`${size}px`}}
        className="w-64 h-auto rounded shadow"
      />
    </div>
  );
}
