"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, X } from "lucide-react";

export default function CreateCapsule({ userPlan = "TIME_KEEPER" }: { userPlan?: string }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  // 1. Define Plan Limits
  const limits = {
    FREE: { maxYears: 1, allowMedia: false, sizeLimit: 0 },
    TIME_KEEPER: { maxYears: 10, allowMedia: true, sizeLimit: 3 * 1024 * 1024 }, // 3MB
    TIME_LORD: { maxYears: 50, allowMedia: true, sizeLimit: 10 * 1024 * 1024 }, // 10MB
  }[userPlan] || { maxYears: 1, allowMedia: false, sizeLimit: 0 };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + limits.maxYears);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // 2. Handle File Selection & Conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check Size Limit
    if (file.size > limits.sizeLimit) {
      alert(`File too large! Your plan allows max ${limits.sizeLimit / 1024 / 1024}MB.`);
      e.target.value = ""; // Clear input
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title"),
      message: formData.get("message"),
      unlockDate: formData.get("date"),
      recipientEmail: formData.get("recipientEmail"),
      fileUrl: imagePreview, // 👈 Sending the image string here
    };

    const res = await fetch("/api/capsules", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }, // Important for large payloads
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
        
        {/* Title & Email inputs (Same as before) */}
        <div>
           <label className="block text-sm font-medium mb-2">Title</label>
           <input name="title" required className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Recipient Email</label>
          <input name="recipientEmail" type="email" required placeholder="who@example.com" className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>

        {/* Message */}
        <div>
           <label className="block text-sm font-medium mb-2">Message</label>
           <textarea name="message" required rows={4} className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>

        {/* Unlock Date */}
        <div>
           <label className="block text-sm font-medium mb-2">Unlock Date (Max {limits.maxYears} years)</label>
           <input name="date" type="date" required max={maxDateStr} className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>

        {/* --- IMAGE UPLOAD SECTION --- */}
        {limits.allowMedia ? (
          <div>
            <label className="block text-sm font-medium mb-2">Attach Memory (Max 3MB)</label>
            
            {!imagePreview ? (
              // Upload Box
              <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:bg-neutral-800 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="mx-auto h-10 w-10 text-neutral-500 mb-2" />
                <p className="text-sm text-neutral-400">Click to upload photo</p>
              </div>
            ) : (
              // Preview Box
              <div className="relative rounded-xl overflow-hidden border border-neutral-700">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover opacity-80" />
                <button 
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                  Image attached
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm">
             🔒 Upgrade to <strong>Time Keeper</strong> to attach photos.
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Seal Capsule"}
        </button>
      </form>
    </div>
  );
}