"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user || !user.active) {
    return { error: "שם משתמש או סיסמה שגויים" };
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return { error: "שם משתמש או סיסמה שגויים" };
  }

  await createSession({
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  });

  if (user.mustChangePassword) {
    redirect("/change-password");
  }

  redirect(user.role === "TRAINEE" ? "/app" : "/admin");
}
