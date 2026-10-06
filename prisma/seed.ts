import { PrismaClient, MetricUnit } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_METRICS: {
  name: string;
  unit: MetricUnit;
  higherIsBetter: boolean;
  sortOrder: number;
}[] = [
  { name: "מתח", unit: MetricUnit.REPS, higherIsBetter: true, sortOrder: 1 },
  { name: "מקבילים", unit: MetricUnit.REPS, higherIsBetter: true, sortOrder: 2 },
  {
    name: 'ריצת 2 ק"מ',
    unit: MetricUnit.TIME_SECONDS,
    higherIsBetter: false,
    sortOrder: 3,
  },
  {
    name: 'ריצת 3 ק"מ',
    unit: MetricUnit.TIME_SECONDS,
    higherIsBetter: false,
    sortOrder: 4,
  },
];

async function main() {
  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const isProduction = process.env.NODE_ENV === "production";
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ?? (isProduction ? undefined : "admin123");

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin && !adminPassword) {
    console.log(
      "– לא הוגדר SEED_ADMIN_PASSWORD, לא נוצר משתמש מנהל. יש להגדיר את המשתנה בסביבת הפרודקשן.",
    );
  } else if (!existingAdmin && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        username: adminUsername,
        passwordHash,
        role: "ADMIN",
        fullName: "מנהל התוכנית",
        active: true,
        mustChangePassword: true,
      },
    });
    console.log(
      `✔ נוצר משתמש מנהל: username="${adminUsername}" (יש להחליף סיסמה בכניסה הראשונה)`,
    );
  } else {
    console.log(`– משתמש מנהל "${adminUsername}" כבר קיים, מדלג.`);
  }

  for (const metric of DEFAULT_METRICS) {
    const existing = await prisma.metricDefinition.findFirst({
      where: { name: metric.name },
    });
    if (!existing) {
      await prisma.metricDefinition.create({ data: metric });
      console.log(`✔ נוצר מדד ברירת מחדל: ${metric.name}`);
    }
  }

  const existingGroup = await prisma.group.findFirst();
  if (!existingGroup) {
    await prisma.group.create({ data: { name: "קבוצה א'" } });
    console.log(`✔ נוצרה קבוצת ברירת מחדל: קבוצה א'`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
