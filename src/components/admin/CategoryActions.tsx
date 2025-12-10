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
  const [action, setAction] = useState<string | null>(null);

  const handleAction = async (actionType: string, endpoint: string) => {
    setIsLoading(true);
    setAction(actionType);
    try {
      await fetch(`/api/categories/${category.id}/${endpoint}`, {
        method: "POST",
      });
      router.refresh();
    } finally {
      setIsLoading(false);
      setAction(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }
    setIsLoading(true);
    setAction("delete");
    try {
      await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });
      router.push("/admin/categories");
    } finally {
      setIsLoading(false);
      setAction(null);
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {category.status === "DRAFT" && (
        <button
          onClick={() => handleAction("launch", "launch")}
          disabled={isLoading}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200"
        >
          {isLoading && action === "launch" ? "Launching..." : "🚀 Launch Category"}
        </button>
      )}
      {category.status === "LAUNCHED" && (
        <button
          onClick={() => handleAction("judging", "judging")}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200"
        >
          {isLoading && action === "judging" ? "Starting..." : "⚖️ Start Judging"}
        </button>
      )}
      {category.status === "JUDGING" && (
        <>
          <button
            onClick={() => handleAction("reopen", "reopen")}
            disabled={isLoading}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-all duration-200"
          >
            {isLoading && action === "reopen" ? "Reopening..." : "↩️ Reopen for Entries"}
          </button>
          <button
            onClick={() => handleAction("complete", "complete")}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all duration-200"
          >
            {isLoading && action === "complete" ? "Completing..." : "✅ Complete & Calculate"}
          </button>
        </>
      )}
      
      {/* Delete button - always visible except when completed */}
      {category.status !== "COMPLETED" && (
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all duration-200"
        >
          {isLoading && action === "delete" ? "Deleting..." : "🗑️ Delete"}
        </button>
      )}
    </div>
  );
}
