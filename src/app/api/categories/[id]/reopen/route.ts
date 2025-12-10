import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Reopen category for submissions (go back from JUDGING to LAUNCHED)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const category = await prisma.category.update({
    where: { id: params.id },
    data: { status: "LAUNCHED" },
  });

  return NextResponse.json(category);
}

