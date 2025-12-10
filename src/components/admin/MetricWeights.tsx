"use client";

import { useState, useEffect } from "react";
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
  // Convert weights to percentages (assuming they should sum to 100)
  const [percentages, setPercentages] = useState<Record<string, number>>(() => {
    const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
    return metrics.reduce((acc, m) => ({ 
      ...acc, 
      [m.id]: totalWeight > 0 ? Math.round((m.weight / totalWeight) * 100) : Math.round(100 / metrics.length)
    }), {});
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPercentage = Object.values(percentages).reduce((sum, p) => sum + p, 0);

  const handleSaveWeights = async () => {
    if (totalPercentage !== 100) {
      setError("Weights must add up to 100%");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    try {
      // Convert percentages back to weights (as decimals for calculation)
      const weights = Object.fromEntries(
        Object.entries(percentages).map(([id, pct]) => [id, pct / 100])
      );
      
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
          Assign percentage weights to each metric. Weights must add up to 100%.
        </p>
        
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="flex items-center gap-4">
              <span className="flex-1 font-medium">{metric.name}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={percentages[metric.id]}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                    setPercentages({ ...percentages, [metric.id]: value });
                  }}
                  className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center focus:outline-none focus:border-finder-500/50"
                />
                <span className="text-white/60">%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total indicator */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className={`font-mono text-lg ${
            totalPercentage === 100 
              ? "text-green-400" 
              : "text-red-400"
          }`}>
            {totalPercentage}%
          </span>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSaveWeights}
          disabled={isSubmitting || totalPercentage !== 100}
          className="mt-6 px-6 py-3 bg-finder-500 hover:bg-finder-600 disabled:bg-white/10 disabled:text-white/40 text-white rounded-xl font-medium transition-all duration-200"
        >
          {isSubmitting ? "Saving..." : "Save Weights & Recalculate Scores"}
        </button>
      </div>
    </div>
  );
}
