import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CategoryActions } from "@/components/admin/CategoryActions";
import { MetricWeights } from "@/components/admin/MetricWeights";
import { CopyButton } from "@/components/admin/CopyButton";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({
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
      judgeAssignments: {
        include: { judge: true },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const submissionLink = `${baseUrl}/submit/${category.shareToken}`;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/admin/categories"
            className="text-white/60 hover:text-white text-sm mb-2 inline-block"
          >
            ← Back to Categories
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-white/60">{category.description}</p>
          )}
        </div>
        <CategoryActions category={category} />
      </div>

      {/* Status & Links */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h3 className="font-semibold mb-4">Category Status</h3>
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
          </div>
        </div>

        {category.status !== "DRAFT" && (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="font-semibold mb-4">Submission Link</h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={submissionLink}
                readOnly
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70"
              />
              <CopyButton text={submissionLink} />
            </div>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Metrics</h2>
        <div className="grid gap-3">
          {category.metrics.map((metric, index) => (
            <div
              key={metric.id}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <div className="flex items-center gap-4">
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
              <div className="text-white/60 text-sm">
                Weight: {metric.weight}x
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metric Weights - Only show for judging/completed */}
      {(category.status === "JUDGING" || category.status === "COMPLETED") && (
        <MetricWeights categoryId={category.id} metrics={category.metrics} />
      )}

      {/* Submissions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">
            Submissions ({category.submissions.length})
          </h2>
          {category.status === "COMPLETED" && (
            <Link
              href={`/admin/categories/${category.id}/results`}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Results 🏆
            </Link>
          )}
        </div>
        {category.submissions.length === 0 ? (
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-white/60">No submissions yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {category.submissions.map((submission) => {
              const allScores = submission.scores;
              const avgScore =
                allScores.length > 0
                  ? (allScores.reduce((sum, s) => sum + s.value, 0) / allScores.length).toFixed(1)
                  : null;

              return (
                <div
                  key={submission.id}
                  className="p-5 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{submission.companyName}</h3>
                      <p className="text-sm text-white/60">{submission.contactEmail}</p>
                    </div>
                    <div className="text-right">
                      {submission.totalScore !== null ? (
                        <>
                          <div className="text-2xl font-bold text-finder-400">
                            {submission.totalScore.toFixed(2)}
                          </div>
                          <div className="text-xs text-white/40">Final Score</div>
                        </>
                      ) : avgScore ? (
                        <>
                          <div className="text-2xl font-bold text-finder-400">{avgScore}</div>
                          <div className="text-xs text-white/40">Avg Score</div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {submission.metricValues.map((mv) => {
                      const metric = category.metrics.find((m) => m.id === mv.metricId);
                      return (
                        <span
                          key={mv.id}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            metric?.type === "NUMERIC"
                              ? "bg-midnight-100 text-midnight-700 border border-midnight-200"
                              : "bg-finder-100 text-finder-700 border border-finder-200"
                          }`}
                        >
                          {metric?.name}:{" "}
                          {metric?.type === "NUMERIC"
                            ? mv.numericValue
                            : (mv.textValue?.substring(0, 30) || "") + "..."}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Judges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">
            Judges ({category.judgeAssignments.length})
          </h2>
          <Link
            href={`/admin/categories/${category.id}/judges`}
            className="px-4 py-2 bg-finder-500 hover:bg-finder-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Invite Judges
          </Link>
        </div>
        {category.judgeAssignments.length === 0 ? (
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-white/60">No judges assigned yet</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {category.judgeAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
              >
                <div>
                  <p className="font-medium">{assignment.judge.name || assignment.judge.email}</p>
                  <p className="text-sm text-white/60">{assignment.judge.email}</p>
                </div>
                <span className="text-sm text-white/40">
                  Invited {new Date(assignment.invitedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

