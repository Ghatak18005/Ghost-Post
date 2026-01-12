"use client";

import { updateCapsule } from "@/actions/capsuleActions";
import { PenLine, Mail, Calendar, Save } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditForm({ capsule }: { capsule: any }) {
  // Store the UTC string for the server
  const [dateValue, setDateValue] = useState(capsule.unlockDate.toISOString());
  
  // Store the Local string for the input display
  const [localDisplayStr, setLocalDisplayStr] = useState("");

  useEffect(() => {
    // Convert Database UTC Time -> Browser Local Time for the Input
    const date = new Date(capsule.unlockDate);
    // This creates a string like "YYYY-MM-DDTHH:mm" in local time
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    setLocalDisplayStr(localDate.toISOString().slice(0, 16));
  }, [capsule.unlockDate]);

  return (
    <form action={updateCapsule} className="space-y-6">
      <input type="hidden" name="id" value={capsule.id} />

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Title</label>
        <input 
          type="text" 
          name="title"
          defaultValue={capsule.title}
          required
          className="w-full bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Recipient */}
      <div>
        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Recipient Email</label>
        <div className="relative">
          <input 
            type="email" 
            name="recipientEmail"
            defaultValue={capsule.recipient}
            required
            className="w-full bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
      </div>

      {/* Date (Timezone Fixed) */}
      <div>
        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Unlock Date & Time</label>
        <div className="relative">
          {/* Visible Input (Local Time) */}
          <input 
            type="datetime-local" 
            required
            // Connect to our local state
            value={localDisplayStr}
            className="w-full bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:invert-0 invert-0"
            style={{ colorScheme: "dark" }} 
            onChange={(e) => {
               setLocalDisplayStr(e.target.value);
               // Update hidden UTC value
               if(e.target.value) {
                 const newDate = new Date(e.target.value);
                 setDateValue(newDate.toISOString());
               }
            }}
          />
          {/* Hidden Input (UTC Time for Server) */}
          <input type="hidden" name="scheduledAt" value={dateValue} />
          
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Your Message</label>
        <textarea 
          name="content"
          defaultValue={capsule.content}
          required
          rows={6}
          className="w-full bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <Save size={18} /> Save Changes
      </button>
    </form>
  );
}