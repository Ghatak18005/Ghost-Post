"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, X, FileText, Video } from "lucide-react";

// --- 📜 DIGITAL WILL TEMPLATES ---
const WILL_TEMPLATES = [
  {
    label: "Select a Template...",
    text: ""
  },
  {
    label: "Simple Last Will",
    text: "I, [Name], being of sound mind, declare this to be my Last Will and Testament.\n\n1. I hereby revoke all prior wills.\n2. I give all my tangible personal property to [Name].\n3. I give the residue of my estate to [Name].\n\nSigned on this day: " + new Date().toLocaleDateString()
  },
  {
    label: "Crypto & Financial Access",
    text: "To my loved ones,\n\nHere are the instructions to access my digital assets in case I am gone.\n\n1. Master Password Location: [Safe/Drawer]\n2. Ledger PIN: [Hint]\n3. Exchange 2FA Backup Codes: [Location]\n\nPlease use these wisely."
  },
  {
    label: "Message to My Children",
    text: "My dearest children,\n\nIf you are reading this, I have moved on. I wanted to leave you with some final thoughts and advice that I hope will guide you through life...\n\n1. Always be kind.\n2. Family comes first.\n3. Never stop learning."
  }
];

export default function CreateCapsule({ userPlan = "TIME_LORD" }: { userPlan?: string }) {
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [message, setMessage] = useState("");
  
  const router = useRouter();

  // 1. Define Plan Limits
  const limits = {
    FREE: { maxYears: 1, allowMedia: false, videoAllowed: false, sizeLimit: 0 },
    TIME_KEEPER: { maxYears: 10, allowMedia: true, videoAllowed: false, sizeLimit: 5 * 1024 * 1024 },
    TIME_LORD: { maxYears: 50, allowMedia: true, videoAllowed: true, sizeLimit: 12 * 1024 * 1024 },
  }[userPlan] || { maxYears: 1, allowMedia: false, videoAllowed: false, sizeLimit: 0 };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + limits.maxYears);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // 2. Handle File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size Check
    if (file.size > limits.sizeLimit) {
      alert(`File too large! Your limit is ${limits.sizeLimit / 1024 / 1024}MB.`);
      e.target.value = "";
      return;
    }

    // Type Check
    const isVideo = file.type.startsWith("video/");
    if (isVideo && !limits.videoAllowed) {
      alert("Video attachments require the Time Lord plan.");
      e.target.value = "";
      return;
    }

    // Convert
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFilePreview(result);
      setFileType(isVideo ? "video" : "image");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      message: message, // Use state
      unlockDate: formData.get("date"),
      recipientEmail: formData.get("recipientEmail"),
      fileUrl: filePreview,
    };

    const res = await fetch("/api/capsules", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const json = await res.json();
      alert(json.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Capsule</h1>
        {userPlan === "TIME_LORD" && (
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
            👑 TIME LORD ACTIVE
          </span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Inputs */}
        <div>
           <label className="block text-sm font-medium mb-2">Title</label>
           <input name="title" required className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Recipient Email</label>
          <input name="recipientEmail" type="email" required className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>

        {/* --- 📜 TEMPLATE SELECTOR --- */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Message</label>
            {userPlan === "TIME_LORD" && (
              <select 
                onChange={(e) => setMessage(e.target.value)}
                className="text-xs bg-neutral-800 text-neutral-300 p-1 rounded border border-neutral-700"
              >
                {WILL_TEMPLATES.map((t, i) => (
                  <option key={i} value={t.text}>{t.label}</option>
                ))}
              </select>
            )}
          </div>
          <textarea 
            name="message" 
            required 
            rows={6} 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none font-sans" 
            placeholder="Write your legacy here..."
          />
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">Unlock Date</label>
           <input name="date" type="date" required max={maxDateStr} className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none" />
        </div>

        {/* --- 🎥 MEDIA UPLOAD --- */}
        {limits.allowMedia ? (
          <div>
            <label className="block text-sm font-medium mb-2">
              Attach Memory {limits.videoAllowed ? "(Photo or Video)" : "(Photo Only)"}
            </label>
            
            {!filePreview ? (
              <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:bg-neutral-800 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept={limits.videoAllowed ? "image/*,video/*" : "image/*"} 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {limits.videoAllowed ? <Video className="mx-auto mb-2 text-neutral-500" /> : <UploadCloud className="mx-auto mb-2 text-neutral-500" />}
                <p className="text-sm text-neutral-400">Click to upload</p>
                <p className="text-xs text-neutral-600 mt-1">Max {limits.sizeLimit / 1024 / 1024}MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-black">
                {fileType === "video" ? (
                  <video src={filePreview} controls className="w-full h-48 object-cover opacity-80" />
                ) : (
                  <img src={filePreview} alt="Preview" className="w-full h-48 object-cover opacity-80" />
                )}
                
                <button 
                  type="button"
                  onClick={() => { setFilePreview(null); setFileType(null); }}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm">
             🔒 Upgrade to <strong>Time Keeper</strong> or <strong>Time Lord</strong> to attach files.
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white rounded-xl font-bold hover:brightness-110 transition">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Seal Time Capsule"}
        </button>
      </form>
    </div>
  );
}