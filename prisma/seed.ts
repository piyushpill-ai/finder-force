import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@finderforce.com" },
    update: {},
    create: {
      email: "admin@finderforce.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user:", admin.email);
  console.log("   Password: admin123");

  // Create sample category
  const category = await prisma.category.create({
    data: {
      name: "Best AI Innovation 2025",
      description: "Recognizing groundbreaking AI solutions that transform industries",
      status: "LAUNCHED",
      metrics: {
        create: [
          { name: "Annual Cost Savings ($)", type: "NUMERIC", order: 0, weight: 1.5 },
          { name: "Key Innovation Description", type: "TEXT", order: 1, weight: 1.0 },
          { name: "Users Impacted", type: "NUMERIC", order: 2, weight: 1.2 },
          { name: "Technical Excellence", type: "TEXT", order: 3, weight: 2.0 },
        ],
      },
    },
  });

  console.log("\n✅ Created sample category:", category.name);
  console.log(`   Submission link: http://localhost:3000/submit/${category.shareToken}`);
  
  console.log("\n🚀 Database seeded successfully!");
  console.log("\n📝 Login credentials:");
  console.log("   Email: admin@finderforce.com");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

