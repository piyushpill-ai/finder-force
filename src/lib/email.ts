// Email service using Resend
// Get your API key at https://resend.com (free tier: 100 emails/day)

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.log("📧 Email would be sent to:", to);
    console.log("   Subject:", subject);
    console.log("   (Set RESEND_API_KEY to enable actual email sending)");
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Finder Force <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email failed: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export function getJudgeInviteEmail(judgeName: string, categoryName: string, inviteLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #fff; margin: 0; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; }
        .logo { width: 48px; height: 48px; background: linear-gradient(135deg, #ed9048, #e87425); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; margin-bottom: 24px; }
        h1 { font-size: 28px; margin: 0 0 16px 0; }
        p { color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 16px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #ed9048, #e87425); color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 24px 0; }
        .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 14px; color: rgba(255,255,255,0.5); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">F</div>
        <h1>You're Invited to Judge! ⚖️</h1>
        <p>Hi ${judgeName || "there"},</p>
        <p>You've been invited to be a judge for the <strong>${categoryName}</strong> award category on Finder Force.</p>
        <p>Click the button below to access the judging panel and score submissions:</p>
        <a href="${inviteLink}" class="btn">Start Judging →</a>
        <p>Score each submission's metrics from 1-10. Your scores will help determine the winners!</p>
        <div class="footer">
          <p>If the button doesn't work, copy this link: ${inviteLink}</p>
          <p>— The Finder Force Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

