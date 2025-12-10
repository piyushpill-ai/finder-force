"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Metric {
  id: string;
  name: string;
  type: string;
  weight: number;
}

interface MetricWeightsProps {
  categoryId: string;
  metrics: Metric[];
}

export function MetricWeights({ categoryId, metrics }: MetricWeightsProps) {
  const router = useRouter();
  const [weights, setWeights] = useState<Record<string, number>>(
    metrics.reduce((acc, m) => ({ ...acc, [m.id]: m.weight }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveWeights = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/categories/${categoryId}/weights`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weights }),
      });
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="font-display text-xl font-semibold mb-4">Metric Weights</h2>
      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <p className="text-white/60 mb-6">
          Assign weights to each metric. Higher weights mean more impact on the final score.
        </p>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="flex items-center gap-4">
              <span className="flex-1 font-medium">{metric.name}</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={weights[metric.id]}
                onChange={(e) =>
                  setWeights({ ...weights, [metric.id]: parseFloat(e.target.value) })
                }
                className="w-48 accent-finder-500"
              />
              <span className="w-16 text-right font-mono text-finder-400">
                {weights[metric.id].toFixed(1)}x
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveWeights}
          disabled={isSubmitting}
          className="mt-6 px-6 py-3 bg-finder-500 hover:bg-finder-600 text-white rounded-xl font-medium transition-all duration-200"
        >
          {isSubmitting ? "Saving..." : "Save Weights & Recalculate Scores"}
        </button>
      </div>
    </div>
  );
}

