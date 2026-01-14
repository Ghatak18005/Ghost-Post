"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code"; // The library we just installed
import { Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface UPIScannerProps {
  amount: number;
  planKey: string;
  upiId: string; // Your personal UPI ID (e.g., 'name@okaxis')
  onSuccess: () => void;
}

export default function UPIScanner({ amount, planKey, upiId, onSuccess }: UPIScannerProps) {
  const [timeLeft, setTimeLeft] = useState(60); // 1 Minute Timer
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [utr, setUtr] = useState(""); // Stores the Transaction ID user types
  
  // Format the UPI String (This makes the QR Code work with GPay/PhonePe)
  const upiUrl = `upi://pay?pa=${upiId}&pn=GhostPost&am=${amount}&cu=INR&tn=${planKey}`;

  // 1. Handle the Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    
    // Decrease time every second
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 2. Function to Reload Timer
  const handleReload = () => {
    setTimeLeft(60);
    setIsExpired(false);
    setUtr("");
  };

  // 3. Handle "I Have Paid" (Verify Transaction)
  const handleVerify = async () => {
    if (!utr) return alert("Please enter the Transaction ID (UTR) from your UPI app.");
    
    setLoading(true);

    try {
      // Call our API to upgrade the user
      const res = await fetch("/api/manual-upgrade", {
        method: "POST",
        body: JSON.stringify({ planKey, utr }),
      });

      if (res.ok) {
        onSuccess(); // Close modal / Refresh page
      } else {
        alert("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl max-w-sm mx-auto text-center border border-neutral-200 dark:border-neutral-800 shadow-xl">
      <h3 className="text-lg font-bold mb-2">Scan & Pay ₹{amount}</h3>
      <p className="text-xs text-neutral-500 mb-4">Session expires in: <span className="text-red-500 font-mono text-lg">{timeLeft}s</span></p>

      {/* QR Code Area */}
      <div className="relative mx-auto w-48 h-48 bg-white p-2 rounded-xl mb-6">
        {isExpired ? (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
            <p className="text-sm font-bold text-neutral-800 mb-2">QR Expired</p>
            <button 
              onClick={handleReload}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-neutral-800 transition"
            >
              <RefreshCw size={14} /> Reload
            </button>
          </div>
        ) : (
          <QRCode 
            value={upiUrl} 
            size={180} 
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />
        )}
      </div>

      {/* Manual Verification Input */}
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Enter UPI Ref ID / UTR (12 digits)" 
          className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          disabled={isExpired}
        />
        
        <button
          onClick={handleVerify}
          disabled={loading || isExpired || utr.length < 4}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Verify Payment"}
        </button>
      </div>
      
     <p className="text-[10px] text-neutral-400 mt-4">
  Open GPay/PhonePe/Paytm &gt; Scan QR &gt; Pay &gt; Enter UTR above.
</p>
    </div>
  );
}