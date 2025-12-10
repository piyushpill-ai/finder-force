"use client";

import { useState } from "react";
import { EditCategoryModal } from "./EditCategoryModal";
import { EditMetricModal } from "./EditMetricModal";

interface Metric {
  id: string;
  name: string;
  type: string;
  description: string | null;
  weight: number;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  status: string;
  metrics: Metric[];
}

interface CategoryDetailClientProps {
  category: Category;
}

export function CategoryHeader({ category }: CategoryDetailClientProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-bold">{category.name}</h1>
        {category.status === "DRAFT" && (
          <button
            onClick={() => setShowEditModal(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
            title="Edit category"
          >
            ✏️
          </button>
        )}
      </div>
      {category.description && (
        <p className="text-white/60 mt-2">{category.description}</p>
      )}
      
      {showEditModal && (
        <EditCategoryModal 
          category={category} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </>
  );
}

export function MetricsList({ category }: CategoryDetailClientProps) {
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);

  return (
    <>
      <div className="grid gap-3">
        {category.metrics.map((metric, index) => (
          <div
            key={metric.id}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group"
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <div>
                <span className="font-medium">{metric.name}</span>
                {metric.description && (
                  <p className="text-sm text-white/40 mt-0.5">{metric.description}</p>
                )}
              </div>
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
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">
                Weight: {Math.round(metric.weight * 100)}%
              </span>
              {category.status === "DRAFT" && (
                <button
                  onClick={() => setEditingMetric(metric)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white opacity-0 group-hover:opacity-100"
                  title="Edit metric"
                >
                  ✏️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {editingMetric && (
        <EditMetricModal 
          metric={editingMetric} 
          onClose={() => setEditingMetric(null)} 
        />
      )}
    </>
  );
}

