import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { categoryId, companyName, contactEmail, contactName, metricValues } = body;

  const submission = await prisma.submission.create({
    data: {
      categoryId,
      companyName,
      contactEmail,
      contactName,
      metricValues: {
        create: metricValues.map((mv: any) => {
          const isNumeric = !isNaN(Number(mv.value)) && mv.value !== "";
          return {
            metricId: mv.metricId,
            textValue: !isNumeric ? mv.value : null,
            numericValue: isNumeric ? parseFloat(mv.value) : null,
          };
        }),
      },
    },
    include: {
      metricValues: true,
    },
  });

  return NextResponse.json(submission);
}

