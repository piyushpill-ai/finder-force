import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      metrics: { orderBy: { order: "asc" } },
      submissions: {
        include: {
          metricValues: true,
          scores: {
            include: { judge: true },
          },
        },
        orderBy: { totalScore: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/admin/categories/${params.id}`}
          className="text-white/60 hover:text-white text-sm mb-2 inline-block"
        >
          ← Back to Category
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">Results: {category.name}</h1>
        <p className="text-white/60">Final rankings based on weighted scores</p>
      </div>

      {category.status !== "COMPLETED" ? (
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
          <p className="text-white/60">
            Results will be available once judging is complete and scores are calculated.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {category.submissions.map((submission, index) => (
            <div
              key={submission.id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30"
                  : index === 2
                  ? "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : index === 1
                        ? "bg-gray-400 text-black"
                        : index === 2
                        ? "bg-amber-600 text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {index === 0 ? "🏆" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{submission.companyName}</h3>
                    <p className="text-sm text-white/60">{submission.contactEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl font-bold text-finder-400">
                    {submission.totalScore?.toFixed(2) || "N/A"}
                  </div>
                  <div className="text-xs text-white/40">Weighted Score</div>
                </div>
              </div>

              {/* Metric breakdown */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-3">
                  {category.metrics.map((metric) => {
                    const metricScores = submission.scores.filter((s) => s.metricId === metric.id);
                    const avgScore =
                      metricScores.length > 0
                        ? metricScores.reduce((sum, s) => sum + s.value, 0) / metricScores.length
                        : null;

                    return (
                      <div
                        key={metric.id}
                        className="px-3 py-2 bg-white/5 rounded-lg text-sm"
                      >
                        <span className="text-white/60">{metric.name}:</span>{" "}
                        <span className="font-medium">
                          {avgScore?.toFixed(1) || "—"}
                        </span>
                        <span className="text-white/40 text-xs ml-1">
                          (×{metric.weight})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

