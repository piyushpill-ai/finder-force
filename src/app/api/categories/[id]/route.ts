import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UPDATE category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { name, description } = body;

  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name, description },
  });

  return NextResponse.json(category);
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.category.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}

