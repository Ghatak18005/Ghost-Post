"use client";

import { Trash2, Edit2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CapsuleActions({ id, canEdit, canDelete }: { id: string, canEdit: boolean, canDelete: boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this capsule permanently? This cannot be undone.")) return;
    
    setIsDeleting(true);
    const res = await fetch(`/api/capsules/${id}`, { method: "DELETE" });
    
    if (res.ok) {
      router.refresh(); 
    } else {
      const json = await res.json();
      alert(json.error); 
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm p-1.5 rounded-lg">
      {/* Edit Button */}
      <button 
        onClick={() => router.push(`/dashboard/edit/${id}`)}
        disabled={!canEdit}
        className={`p-2 rounded-md transition-colors ${
          canEdit 
            ? "hover:bg-white/10 text-white" 
            : "cursor-not-allowed text-neutral-500"
        }`}
        title={canEdit ? "Edit Capsule" : "Locked (Less than 1h left)"}
      >
        <Edit2 size={16} />
      </button>

      {/* Delete Button with Loading State */}
      <button 
        onClick={handleDelete}
        disabled={!canDelete || isDeleting}
        className={`p-2 rounded-md transition-colors ${
          canDelete 
            ? "hover:bg-red-500/20 text-red-400 hover:text-red-500" 
            : "cursor-not-allowed text-neutral-500"
        }`}
        title={canDelete ? "Delete Capsule" : "Locked (Less than 24h left)"}
      >
        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}