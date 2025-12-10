import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UPDATE metric
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { name, description, weight } = body;

  const metric = await prisma.metric.update({
    where: { id: params.id },
    data: { 
      name, 
      description,
      weight: weight !== undefined ? weight : undefined,
    },
  });

  return NextResponse.json(metric);
}

// DELETE metric
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.metric.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}

