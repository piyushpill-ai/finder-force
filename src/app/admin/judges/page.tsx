import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function JudgesPage() {
  const judges = await prisma.user.findMany({
    where: { role: "JUDGE" },
    include: {
      judgeAssignments: {
        include: { category: true },
      },
      scores: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Judges</h1>
        <p className="text-white/60">Manage your judging panel</p>
      </div>

      {judges.length === 0 ? (
        <div className="p-12 bg-white/5 border border-white/10 rounded-2xl text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="font-display text-xl font-semibold mb-2">No judges yet</h3>
          <p className="text-white/60">Invite judges from a category page</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {judges.map((judge) => (
            <div
              key={judge.id}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold">
                    {judge.name || judge.email}
                  </h3>
                  <p className="text-sm text-white/60">{judge.email}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-finder-400">{judge.scores.length}</div>
                  <div className="text-xs text-white/40">Scores given</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {judge.judgeAssignments.map((assignment) => (
                  <span
                    key={assignment.id}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    {assignment.category.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

