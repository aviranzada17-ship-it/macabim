"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export type RegisterState = {
  error?: string;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  const { fullName, username, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: `שם המשתמש "${username}" כבר תפוס, יש לבחור שם אחר` };
  }

  const nameParts = fullName.split(/\s+/);
  const lastName = nameParts.slice(1).join(" ") || nameParts[0];

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: await hashPassword(password),
      role: "TRAINEE",
      fullName,
      mustChangePassword: false,
      traineeProfile: {
        create: {
          lastName,
          onboardingCompleted: false,
        },
      },
    },
  });

  await createSession({
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    mustChangePassword: false,
  });

  redirect("/onboarding");
}
