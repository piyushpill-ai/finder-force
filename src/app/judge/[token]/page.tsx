import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { JudgePanel } from "@/components/judge/JudgePanel";

export const dynamic = "force-dynamic";

export default async function JudgePage({
  params,
}: {
  params: { token: string };
}) {
  const assignment = await prisma.judgeAssignment.findUnique({
    where: { inviteToken: params.token },
    include: {
      judge: true,
      category: {
        include: {
          metrics: { orderBy: { order: "asc" } },
          submissions: {
            include: {
              metricValues: true,
            },
          },
        },
      },
    },
  });

  if (!assignment || assignment.category.status !== "JUDGING") {
    notFound();
  }

  // Get existing scores by this judge
  const existingScores = await prisma.score.findMany({
    where: {
      judgeId: assignment.judgeId,
      submission: {
        categoryId: assignment.categoryId,
      },
    },
  });

  return (
    <main className="min-h-screen bg-mesh relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-midnight-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-finder-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-4">
            <span className="text-sm text-white/70">⚖️ Judge Panel</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2">
            {assignment.category.name}
          </h1>
          <p className="text-white/60">
            Welcome, {assignment.judge.name || assignment.judge.email}. Score each submission below.
          </p>
        </div>

        <JudgePanel
          category={assignment.category}
          judgeId={assignment.judgeId}
          existingScores={existingScores}
        />
      </div>
    </main>
  );
}

