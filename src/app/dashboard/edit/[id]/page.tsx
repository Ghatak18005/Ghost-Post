"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, UploadCloud, Video, X } from "lucide-react";

// --- 📜 TEMPLATES (Same as Create Page) ---
const WILL_TEMPLATES = [
  { label: "Select a Template...", text: "" },
  { label: "Simple Last Will", text: "I, [Name], being of sound mind..." },
  { label: "Crypto Access", text: "To my loved ones, here are the instructions..." },
  { label: "Message to Children", text: "My dearest children..." }
];

export default function EditCapsulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  
  // File State
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  // 1. Fetch Data on Load
  useEffect(() => {
    fetch(`/api/capsules/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load capsule");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setMessage(data.message);
        setRecipientEmail(data.recipientEmail || "");
        
        // Handle existing file preview
        if (data.fileUrl) {
          setFilePreview(data.fileUrl);
          // Simple check: if it starts with 'data:video', it's a video
          setFileType(data.fileUrl.startsWith("data:video") ? "video" : "image");
        }
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load capsule or access denied.");
        setFetching(false);
      });
  }, [id]);

  // 2. Handle New File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic Size Limit Check (Soft check for 12MB max)
    if (file.size > 12 * 1024 * 1024) {
      alert("File too large! Max 12MB.");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
      setFileType(isVideo ? "video" : "image");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const res = await fetch(`/api/capsules/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        message,
        recipientEmail,
        fileUrl: filePreview // Sends the new (or old) base64 string
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const json = await res.json();
      alert(json.error);
      setSaving(false);
    }
  };

  if (fetching) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

  return (
    <div className="min-h-screen bg-neutral-950 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-800 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Capsule</h1>
          <button onClick={() => router.back()} className="text-neutral-400 hover:text-white flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Cancel
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
             <label className="block text-sm font-medium text-neutral-400 mb-2">Title</label>
             <input 
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-purple-500 outline-none"
               required
             />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Recipient Email</label>
            <input 
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-purple-500 outline-none"
              required
            />
          </div>

          {/* Template & Message */}
          <div>
             <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-neutral-400">Message</label>
                <select 
                  onChange={(e) => setMessage(e.target.value)}
                  className="text-xs bg-neutral-800 text-neutral-300 p-1 rounded border border-neutral-700"
                >
                  {WILL_TEMPLATES.map((t, i) => <option key={i} value={t.text}>{t.label}</option>)}
                </select>
             </div>
             <textarea 
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               rows={6}
               className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-purple-500 outline-none resize-none"
               required
             />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Attached Memory</label>
            
            {!filePreview ? (
              <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:bg-neutral-800 transition cursor-pointer relative group">
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud className="mx-auto mb-2 text-neutral-500 group-hover:text-purple-500 transition" />
                <p className="text-sm text-neutral-400">Click to upload new Photo or Video</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-black">
                {fileType === "video" ? (
                  <video src={filePreview} controls className="w-full h-48 object-cover opacity-80" />
                ) : (
                  <img src={filePreview} alt="Preview" className="w-full h-48 object-cover opacity-80" />
                )}
                
                {/* Remove Button */}
                <button 
                  type="button"
                  onClick={() => { setFilePreview(null); setFileType(null); }}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition"
                  title="Remove File"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Save Buttons */}
          <div className="flex gap-4 pt-4">
             <button
               type="button"
               onClick={() => router.back()}
               className="flex-1 py-3 bg-neutral-800 text-white rounded-xl font-bold hover:bg-neutral-700 transition"
             >
               Discard
             </button>

             <button 
               type="submit" 
               disabled={saving} 
               className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2"
             >
               {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Save Changes</>}
             </button>
          </div>
        </form>

      </div>
    </div>
  );
}