"use client";

import { useState } from "react";

interface Metric {
  id: string;
  name: string;
  type: string;
}

interface MetricValue {
  id: string;
  metricId: string;
  textValue: string | null;
  numericValue: number | null;
}

interface Submission {
  id: string;
  companyName: string;
  contactEmail: string;
  metricValues: MetricValue[];
}

interface Score {
  id: string;
  value: number;
  metricId: string;
  submissionId: string;
}

interface JudgePanelProps {
  category: {
    id: string;
    name: string;
    metrics: Metric[];
    submissions: Submission[];
  };
  judgeId: string;
  existingScores: Score[];
}

export function JudgePanel({ category, judgeId, existingScores }: JudgePanelProps) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    existingScores.forEach((s) => {
      initial[`${s.submissionId}-${s.metricId}`] = s.value;
    });
    return initial;
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const handleScore = async (submissionId: string, metricId: string, value: number) => {
    const key = `${submissionId}-${metricId}`;
    setScores({ ...scores, [key]: value });
    setSaving(key);

    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judgeId,
          submissionId,
          metricId,
          value,
        }),
      });
      setSavedKeys(new Set([...savedKeys, key]));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-8">
      {category.submissions.map((submission, index) => (
        <div
          key={submission.id}
          className="p-6 bg-white/5 border border-white/10 rounded-2xl animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold">{submission.companyName}</h2>
              <p className="text-white/60">{submission.contactEmail}</p>
            </div>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
              Entry #{index + 1}
            </span>
          </div>

          <div className="space-y-6">
            {category.metrics.map((metric) => {
              const metricValue = submission.metricValues.find(
                (mv) => mv.metricId === metric.id
              );
              const key = `${submission.id}-${metric.id}`;
              const currentScore = scores[key];

              return (
                <div key={metric.id} className="border-t border-white/10 pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{metric.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            metric.type === "NUMERIC"
                              ? "bg-midnight-100 text-midnight-700"
                              : "bg-finder-100 text-finder-700"
                          }`}
                        >
                          {metric.type === "NUMERIC" ? "🔢" : "📝"}
                        </span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        {metric.type === "NUMERIC" ? (
                          <span className="font-mono text-2xl text-finder-400">
                            {metricValue?.numericValue}
                          </span>
                        ) : (
                          <p className="text-white/80">{metricValue?.textValue}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score Selection */}
                  <div>
                    <label className="block text-sm text-white/60 mb-3">
                      Your Score (1-10)
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleScore(submission.id, metric.id, value)}
                          disabled={saving === key}
                          className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                            currentScore === value
                              ? "bg-finder-500 text-white shadow-lg shadow-finder-500/30"
                              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                          } ${savedKeys.has(key) && currentScore === value ? "ring-2 ring-green-500/50" : ""}`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {category.submissions.length === 0 && (
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
          <p className="text-white/60">No submissions to judge yet.</p>
        </div>
      )}
    </div>
  );
}

