import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { judgeId, submissionId, metricId, value } = body;

  const score = await prisma.score.upsert({
    where: {
      judgeId_metricId_submissionId: {
        judgeId,
        metricId,
        submissionId,
      },
    },
    update: { value },
    create: {
      judgeId,
      submissionId,
      metricId,
      value,
    },
  });

  return NextResponse.json(score);
}

