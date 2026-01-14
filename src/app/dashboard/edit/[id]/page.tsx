"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";

export default function EditCapsulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [error, setError] = useState("");

  // 1. Fetch Existing Data on Load
  useEffect(() => {
    fetch(`/api/capsules/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load capsule");
        return res.json();
      })
      .then((data) => {
        setFormData({ title: data.title, message: data.message });
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load capsule or access denied.");
        setFetching(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const res = await fetch(`/api/capsules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error);
      setSaving(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-800 p-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Capsule</h1>
          {/* Back Button (Cancel) */}
          <button 
            type="button"
            onClick={() => router.back()} 
            className="text-neutral-400 hover:text-white transition flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={16} /> Cancel
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-neutral-400 mb-2">Title</label>
             <input 
               value={formData.title}
               onChange={(e) => setFormData({...formData, title: e.target.value})}
               className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-purple-500 focus:outline-none transition"
               placeholder="Capsule Title"
               required
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-neutral-400 mb-2">Message</label>
             <textarea 
               value={formData.message}
               onChange={(e) => setFormData({...formData, message: e.target.value})}
               rows={6}
               className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-purple-500 focus:outline-none transition resize-none"
               placeholder="Your secret message..."
               required
             />
          </div>

          <div className="flex gap-4 pt-4">
             {/* Cancel Button (Secondary) */}
             <button
               type="button"
               onClick={() => router.back()}
               className="flex-1 py-3 bg-neutral-800 text-white rounded-xl font-bold hover:bg-neutral-700 transition"
             >
               Discard Changes
             </button>

             {/* Save Button (Primary) */}
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