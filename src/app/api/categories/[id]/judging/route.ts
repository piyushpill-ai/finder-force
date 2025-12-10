import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const category = await prisma.category.update({
    where: { id: params.id },
    data: { status: "JUDGING" },
  });

  return NextResponse.json(category);
}

