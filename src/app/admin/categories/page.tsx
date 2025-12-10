import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { submissions: true, metrics: true, judgeAssignments: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Categories</h1>
          <p className="text-white/60">Manage your award categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="px-6 py-3 bg-finder-500 hover:bg-finder-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-finder-500/25"
        >
          + New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="font-display text-xl font-semibold mb-2">No categories yet</h3>
          <p className="text-white/60 mb-6">Create your first award category to get started</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-finder-500 hover:bg-finder-600 text-white rounded-xl font-medium transition-all duration-200"
          >
            Create Category
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/admin/categories/${category.id}`}
              className="group flex items-center justify-between p-6 bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:border-finder-500/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-finder-400/20 to-finder-600/20 rounded-xl flex items-center justify-center border border-finder-500/20">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold group-hover:text-finder-400 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-sm text-white/60">
                      <span className="w-1.5 h-1.5 bg-finder-400 rounded-full" />
                      {category._count.metrics} metrics
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-white/60">
                      <span className="w-1.5 h-1.5 bg-midnight-400 rounded-full" />
                      {category._count.submissions} submissions
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-white/60">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      {category._count.judgeAssignments} judges
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    category.status === "LAUNCHED"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : category.status === "JUDGING"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : category.status === "COMPLETED"
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-white/10 text-white/60 border border-white/20"
                  }`}
                >
                  {category.status}
                </span>
                <span className="text-white/40 group-hover:text-finder-400 transition-colors text-xl">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

