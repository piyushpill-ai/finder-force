import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { weights } = body;

  // Update each metric's weight
  for (const [metricId, weight] of Object.entries(weights)) {
    await prisma.metric.update({
      where: { id: metricId },
      data: { weight: weight as number },
    });
  }

  return NextResponse.json({ success: true });
}

