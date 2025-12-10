import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, getJudgeInviteEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name, categoryId } = body;

  // Get category info
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // Create or get judge user
  let judge = await prisma.user.findUnique({ where: { email } });

  if (!judge) {
    const tempPassword = uuidv4().slice(0, 8);
    judge = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(tempPassword, 10),
        role: "JUDGE",
      },
    });
  }

  // Check if assignment already exists
  const existingAssignment = await prisma.judgeAssignment.findUnique({
    where: {
      judgeId_categoryId: {
        judgeId: judge.id,
        categoryId,
      },
    },
  });

  if (existingAssignment) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/judge/${existingAssignment.inviteToken}`;
    
    return NextResponse.json({
      assignment: existingAssignment,
      inviteLink,
      message: "Judge already invited",
    });
  }

  // Create assignment
  const assignment = await prisma.judgeAssignment.create({
    data: {
      judgeId: judge.id,
      categoryId,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/judge/${assignment.inviteToken}`;

  // Send email invitation
  const emailHtml = getJudgeInviteEmail(name || email, category.name, inviteLink);
  const emailResult = await sendEmail({
    to: email,
    subject: `You're invited to judge: ${category.name}`,
    html: emailHtml,
  });

  return NextResponse.json({ 
    assignment, 
    inviteLink,
    emailSent: emailResult.success,
  });
}
