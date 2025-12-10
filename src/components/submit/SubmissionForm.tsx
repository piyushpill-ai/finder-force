"use client";

import { useState } from "react";

interface Metric {
  id: string;
  name: string;
  type: string;
  description: string | null;
}

interface Category {
  id: string;
  name: string;
  metrics: Metric[];
}

interface SubmissionFormProps {
  category: Category;
}

export function SubmissionForm({ category }: SubmissionFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: category.id,
          companyName,
          contactEmail,
          contactName,
          metricValues: category.metrics.map((m) => ({
            metricId: m.id,
            value: metricValues[m.id] || "",
          })),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-display text-2xl font-bold mb-2">Submission Received!</h2>
        <p className="text-white/60">
          Thank you for your submission. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <h2 className="font-semibold text-lg mb-4">Company Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all"
              placeholder="Enter your company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Contact Email *
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Contact Name
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all"
              placeholder="Your name"
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <h2 className="font-semibold text-lg mb-4">Entry Details</h2>
        <div className="space-y-6">
          {category.metrics.map((metric) => (
            <div key={metric.id}>
              <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                {metric.name} *
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    metric.type === "NUMERIC"
                      ? "bg-midnight-100 text-midnight-700"
                      : "bg-finder-100 text-finder-700"
                  }`}
                >
                  {metric.type === "NUMERIC" ? "🔢 Number" : "📝 Text"}
                </span>
              </label>
              {metric.description && (
                <p className="text-sm text-white/40 mb-2">{metric.description}</p>
              )}
              {metric.type === "NUMERIC" ? (
                <input
                  type="number"
                  step="any"
                  value={metricValues[metric.id] || ""}
                  onChange={(e) =>
                    setMetricValues({ ...metricValues, [metric.id]: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all"
                  placeholder="Enter a number"
                />
              ) : (
                <textarea
                  value={metricValues[metric.id] || ""}
                  onChange={(e) =>
                    setMetricValues({ ...metricValues, [metric.id]: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all resize-none"
                  placeholder="Describe in detail..."
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-gradient-to-r from-finder-500 to-finder-600 hover:from-finder-600 hover:to-finder-700 disabled:from-white/10 disabled:to-white/10 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-finder-500/30"
      >
        {isSubmitting ? "Submitting..." : "Submit Entry"}
      </button>
    </form>
  );
}

