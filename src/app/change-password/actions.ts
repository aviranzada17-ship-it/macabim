"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, getSession, hashPassword } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validation";

export type ChangePasswordState = {
  error?: string;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const parsed = changePasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);

  await prisma.user.update({
    where: { id: session.userId },
    data: { passwordHash, mustChangePassword: false },
  });

  await createSession({ ...session, mustChangePassword: false });

  if (session.role === "TRAINEE") {
    const profile = await prisma.traineeProfile.findUnique({
      where: { userId: session.userId },
      select: { onboardingCompleted: true },
    });
    redirect(profile?.onboardingCompleted ? "/app" : "/onboarding");
  }

  redirect("/admin");
}
