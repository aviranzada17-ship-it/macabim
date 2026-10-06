"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { goalSchema } from "@/lib/validation";

export type GoalState = {
  error?: string;
};

export async function setGoalAction(
  _prevState: GoalState,
  formData: FormData,
): Promise<GoalState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const traineeIdParam = formData.get("traineeId")?.toString() || null;

  let traineeId: string;
  if (traineeIdParam) {
    if (session.role === "TRAINEE") redirect("/app");
    traineeId = traineeIdParam;
  } else {
    const profile = await prisma.traineeProfile.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });
    if (!profile) redirect("/login");
    traineeId = profile.id;
  }

  const parsed = goalSchema.safeParse({
    metricId: formData.get("metricId"),
    targetValue: formData.get("targetValue"),
    targetDate: formData.get("targetDate") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  await prisma.$transaction([
    prisma.goal.updateMany({
      where: { traineeId, metricId: parsed.data.metricId, status: "ACTIVE" },
      data: { status: "ARCHIVED" },
    }),
    prisma.goal.create({
      data: {
        traineeId,
        metricId: parsed.data.metricId,
        targetValue: parsed.data.targetValue,
        targetDate: parsed.data.targetDate
          ? new Date(parsed.data.targetDate)
          : null,
      },
    }),
  ]);

  revalidatePath("/app");
  revalidatePath("/app/goals");
  revalidatePath(`/admin/trainees/${traineeId}`);

  if (traineeIdParam) {
    redirect(`/admin/trainees/${traineeId}`);
  }
  redirect("/app/goals");
}
