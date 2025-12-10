import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      metricValues: {
        include: { metric: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">All Submissions</h1>
        <p className="text-white/60">View all submissions across categories</p>
      </div>

      {submissions.length === 0 ? (
        <div className="p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="font-display text-xl font-semibold mb-2">No submissions yet</h3>
          <p className="text-white/60">Submissions will appear here once companies start submitting entries</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">{submission.companyName}</h3>
                  <p className="text-sm text-white/60">{submission.contactEmail}</p>
                </div>
                <Link
                  href={`/admin/categories/${submission.categoryId}`}
                  className="px-3 py-1 bg-finder-500/20 text-finder-400 rounded-full text-sm font-medium hover:bg-finder-500/30 transition-colors"
                >
                  {submission.category.name}
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {submission.metricValues.map((mv) => (
                  <span
                    key={mv.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      mv.metric.type === "NUMERIC"
                        ? "bg-midnight-100 text-midnight-700 border border-midnight-200"
                        : "bg-finder-100 text-finder-700 border border-finder-200"
                    }`}
                  >
                    {mv.metric.name}:{" "}
                    {mv.metric.type === "NUMERIC"
                      ? mv.numericValue
                      : (mv.textValue?.substring(0, 30) || "") + "..."}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-xs text-white/40">
                Submitted {new Date(submission.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

