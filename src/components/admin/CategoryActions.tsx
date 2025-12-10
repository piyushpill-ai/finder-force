"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryActionsProps {
  category: {
    id: string;
    status: string;
  };
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLaunch = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/categories/${category.id}/launch`, {
        method: "POST",
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartJudging = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/categories/${category.id}/judging`, {
        method: "POST",
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/categories/${category.id}/complete`, {
        method: "POST",
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      {category.status === "DRAFT" && (
        <button
          onClick={handleLaunch}
          disabled={isLoading}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200"
        >
          {isLoading ? "Launching..." : "🚀 Launch Category"}
        </button>
      )}
      {category.status === "LAUNCHED" && (
        <button
          onClick={handleStartJudging}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200"
        >
          {isLoading ? "Starting..." : "⚖️ Start Judging"}
        </button>
      )}
      {category.status === "JUDGING" && (
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all duration-200"
        >
          {isLoading ? "Completing..." : "✅ Complete & Calculate"}
        </button>
      )}
    </div>
  );
}

