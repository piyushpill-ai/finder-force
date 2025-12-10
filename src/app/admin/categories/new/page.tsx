"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type MetricType = "TEXT" | "NUMERIC";

interface Metric {
  id: string;
  name: string;
  type: MetricType;
  description: string;
}

export default function NewCategoryPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "metrics">("details");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [newMetricName, setNewMetricName] = useState("");
  const [showTypePrompt, setShowTypePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMetric = () => {
    if (newMetricName.trim()) {
      setShowTypePrompt(true);
    }
  };

  const handleSelectType = (type: MetricType) => {
    const metric: Metric = {
      id: crypto.randomUUID(),
      name: newMetricName.trim(),
      type,
      description: "",
    };
    setMetrics([...metrics, metric]);
    setNewMetricName("");
    setShowTypePrompt(false);
  };

  const handleRemoveMetric = (id: string) => {
    setMetrics(metrics.filter((m) => m.id !== id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription,
          metrics: metrics.map((m, index) => ({
            name: m.name,
            type: m.type,
            description: m.description,
            order: index,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/categories/${data.id}`);
      }
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/categories" className="text-white/60 hover:text-white text-sm mb-2 inline-block">
          ← Back to Categories
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">Create Category</h1>
        <p className="text-white/60">Set up a new award category with custom metrics</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {["details", "metrics"].map((s, index) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step === s
                  ? "bg-finder-500 text-white"
                  : index < ["details", "metrics"].indexOf(step)
                  ? "bg-finder-500/20 text-finder-400"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`capitalize ${
                step === s ? "text-white" : "text-white/40"
              }`}
            >
              {s}
            </span>
            {index < 1 && (
              <div className="w-12 h-0.5 bg-white/10 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Category Details */}
      {step === "details" && (
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl animate-fade-in">
          <h2 className="font-display text-xl font-semibold mb-6">Category Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Best AI Innovation"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Description (optional)
              </label>
              <textarea
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Describe what this category is about..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setStep("metrics")}
              disabled={!categoryName.trim()}
              className="px-6 py-3 bg-finder-500 hover:bg-finder-600 disabled:bg-white/10 disabled:text-white/40 text-white rounded-xl font-medium transition-all duration-200"
            >
              Next: Add Metrics →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Add Metrics */}
      {step === "metrics" && (
        <div className="animate-fade-in">
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl mb-6">
            <h2 className="font-display text-xl font-semibold mb-6">Add Metrics</h2>
            <p className="text-white/60 mb-6">
              Define the criteria companies will be judged on. Each metric can be either text-based or numeric.
            </p>

            {/* Added Metrics */}
            {metrics.length > 0 && (
              <div className="space-y-3 mb-6">
                {metrics.map((metric, index) => (
                  <div
                    key={metric.id}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium">{metric.name}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          metric.type === "NUMERIC"
                            ? "bg-midnight-100 text-midnight-700 border border-midnight-200"
                            : "bg-finder-100 text-finder-700 border border-finder-200"
                        }`}
                      >
                        {metric.type === "NUMERIC" ? "🔢 Numeric" : "📝 Text"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveMetric(metric.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/40 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Metric */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newMetricName}
                onChange={(e) => setNewMetricName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMetric()}
                placeholder="Enter metric name (e.g., Annual Cost, Top Feature)"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all"
              />
              <button
                onClick={handleAddMetric}
                disabled={!newMetricName.trim()}
                className="px-6 py-3 bg-finder-500 hover:bg-finder-600 disabled:bg-white/10 disabled:text-white/40 text-white rounded-xl font-medium transition-all duration-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Type Selection Modal */}
          {showTypePrompt && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
              <div className="p-8 bg-midnight-900 border border-white/10 rounded-2xl max-w-md w-full mx-4 animate-scale-in">
                <h3 className="font-display text-xl font-semibold mb-2">
                  Select Metric Type
                </h3>
                <p className="text-white/60 mb-6">
                  What type of value will companies enter for &quot;{newMetricName}&quot;?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSelectType("NUMERIC")}
                    className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-midnight-400 hover:bg-midnight-500/10 transition-all duration-200 text-center group"
                  >
                    <span className="text-3xl mb-3 block">🔢</span>
                    <span className="font-medium group-hover:text-midnight-400">Numeric</span>
                    <p className="text-sm text-white/40 mt-1">Numbers, amounts, percentages</p>
                  </button>
                  <button
                    onClick={() => handleSelectType("TEXT")}
                    className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-finder-400 hover:bg-finder-500/10 transition-all duration-200 text-center group"
                  >
                    <span className="text-3xl mb-3 block">📝</span>
                    <span className="font-medium group-hover:text-finder-400">Text</span>
                    <p className="text-sm text-white/40 mt-1">Descriptions, explanations</p>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowTypePrompt(false);
                    setNewMetricName("");
                  }}
                  className="w-full mt-4 py-3 text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep("details")}
              className="px-6 py-3 text-white/60 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={metrics.length === 0 || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-finder-500 to-finder-600 hover:from-finder-600 hover:to-finder-700 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 text-white rounded-xl font-medium transition-all duration-200"
            >
              {isSubmitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

