import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SubmissionForm } from "@/components/submit/SubmissionForm";

export const dynamic = "force-dynamic";

export default async function SubmitPage({
  params,
}: {
  params: { token: string };
}) {
  const category = await prisma.category.findUnique({
    where: { shareToken: params.token },
    include: {
      metrics: { orderBy: { order: "asc" } },
    },
  });

  if (!category || category.status !== "LAUNCHED") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-mesh relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-finder-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-midnight-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-finder-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/70">Finder Force Awards</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-white/60">{category.description}</p>
          )}
        </div>

        <SubmissionForm category={category} />
      </div>
    </main>
  );
}

