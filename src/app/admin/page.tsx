import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [categoriesCount, submissionsCount, judgesCount] = await Promise.all([
    prisma.category.count(),
    prisma.submission.count(),
    prisma.user.count({ where: { role: "JUDGE" } }),
  ]);

  const recentCategories = await prisma.category.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { submissions: true, metrics: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome to the Finder Force admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Categories", value: categoriesCount, icon: "📁", href: "/admin/categories" },
          { label: "Submissions", value: submissionsCount, icon: "📝", href: "/admin/submissions" },
          { label: "Judges", value: judgesCount, icon: "👥", href: "/admin/judges" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-finder-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-white/40 group-hover:text-finder-400 transition-colors">→</span>
            </div>
            <div className="font-display text-4xl font-bold mb-1">{stat.value}</div>
            <div className="text-white/60">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/categories/new"
            className="px-6 py-3 bg-finder-500 hover:bg-finder-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-finder-500/25"
          >
            + Create Category
          </Link>
        </div>
      </div>

      {/* Recent Categories */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Recent Categories</h2>
        {recentCategories.length === 0 ? (
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-white/60 mb-4">No categories created yet</p>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-finder-500 hover:bg-finder-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              Create Your First Category
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentCategories.map((category) => (
              <Link
                key={category.id}
                href={`/admin/categories/${category.id}`}
                className="group flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-xl hover:border-finder-500/30 transition-all duration-200"
              >
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-finder-400 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                    <span>{category._count.metrics} metrics</span>
                    <span>{category._count.submissions} submissions</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
                  <span className="text-white/40 group-hover:text-finder-400 transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

