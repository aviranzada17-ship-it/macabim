"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validation";

export type OnboardingState = {
  error?: string;
};

export async function submitOnboardingAction(
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const session = await getSession();
  if (!session || session.role !== "TRAINEE") redirect("/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = onboardingSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  const { phone, ...profileData } = parsed.data;

  await prisma.$transaction([
    prisma.traineeProfile.update({
      where: { userId: session.userId },
      data: { ...profileData, onboardingCompleted: true },
    }),
    prisma.user.update({
      where: { id: session.userId },
      data: { phone },
    }),
  ]);

  revalidatePath("/app");
  redirect("/app");
}
