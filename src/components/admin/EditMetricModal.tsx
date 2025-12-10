"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditMetricModalProps {
  metric: {
    id: string;
    name: string;
    description: string | null;
    type: string;
  };
  onClose: () => void;
}

export function EditMetricModal({ metric, onClose }: EditMetricModalProps) {
  const router = useRouter();
  const [name, setName] = useState(metric.name);
  const [description, setDescription] = useState(metric.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch(`/api/metrics/${metric.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      router.refresh();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this metric?")) return;
    
    setIsSubmitting(true);
    try {
      await fetch(`/api/metrics/${metric.id}`, {
        method: "DELETE",
      });
      router.refresh();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="p-8 bg-midnight-900 border border-white/10 rounded-2xl max-w-md w-full mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-semibold">Edit Metric</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            metric.type === "NUMERIC"
              ? "bg-midnight-100 text-midnight-700"
              : "bg-finder-100 text-finder-700"
          }`}>
            {metric.type === "NUMERIC" ? "🔢 Numeric" : "📝 Text"}
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Metric Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-finder-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Description (shown to submitters)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Explain what you're looking for in this metric..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-medium transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-finder-500 hover:bg-finder-600 text-white rounded-xl font-medium transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

