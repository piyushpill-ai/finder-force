import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      metrics: { orderBy: { order: "asc" } },
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, metrics } = body;

  const category = await prisma.category.create({
    data: {
      name,
      description,
      metrics: {
        create: metrics.map((m: any, index: number) => ({
          name: m.name,
          type: m.type,
          description: m.description || "",
          order: index,
        })),
      },
    },
    include: {
      metrics: true,
    },
  });

  return NextResponse.json(category);
}

