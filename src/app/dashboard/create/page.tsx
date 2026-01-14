"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateCapsule({ userPlan = "FREE" }: { userPlan?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ... (Keep your existing limits/date logic) ...
  const limits = {
    FREE: { maxYears: 1, allowMedia: false },
    TIME_KEEPER: { maxYears: 10, allowMedia: true },
    TIME_LORD: { maxYears: 50, allowMedia: true },
  }[userPlan] || { maxYears: 1, allowMedia: false };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + limits.maxYears);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // 👇 1. UPDATE THIS BLOCK to include recipientEmail
    const data = {
      title: formData.get("title"),
      message: formData.get("message"),
      unlockDate: formData.get("date"),
      recipientEmail: formData.get("recipientEmail"), // 👈 CRITICAL: This was missing!
      // Add file upload logic here if you implemented it
    };

    const res = await fetch("/api/capsules", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
      <h1 className="text-2xl font-bold mb-6">Create New Capsule</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ... (Keep Title input) ... */}
        <div>
           <label className="block text-sm font-medium mb-2">Title</label>
           <input name="title" required className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>

        {/* 👇 2. MAKE SURE THIS INPUT EXISTS */}
        <div>
          <label className="block text-sm font-medium mb-2">Recipient Email</label>
          <input 
            name="recipientEmail" 
            type="email" 
            required 
            placeholder="who@example.com"
            className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" 
          />
          <p className="text-xs text-neutral-500 mt-1">We will send the message here on the unlock date.</p>
        </div>

        {/* ... (Keep Message, Date, and Button) ... */}
        <div>
           <label className="block text-sm font-medium mb-2">Message</label>
           <textarea name="message" required rows={4} className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">Unlock Date</label>
           <input name="date" type="date" required max={maxDateStr} className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Seal Capsule"}
        </button>
      </form>
    </div>
  );
}