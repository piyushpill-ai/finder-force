import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      metrics: true,
      submissions: {
        include: { scores: true },
      },
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Calculate weighted scores for each submission
  for (const submission of category.submissions) {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const metric of category.metrics) {
      const metricScores = submission.scores.filter((s) => s.metricId === metric.id);
      if (metricScores.length > 0) {
        const avgScore = metricScores.reduce((sum, s) => sum + s.value, 0) / metricScores.length;
        totalWeightedScore += avgScore * metric.weight;
        totalWeight += metric.weight;
      }
    }

    const finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

    await prisma.submission.update({
      where: { id: submission.id },
      data: { totalScore: finalScore },
    });
  }

  // Update category status
  await prisma.category.update({
    where: { id: params.id },
    data: { status: "COMPLETED" },
  });

  return NextResponse.json({ success: true });
}

