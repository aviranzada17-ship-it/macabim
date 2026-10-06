"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { metricEntrySchema } from "@/lib/validation";

export type MetricEntryState = {
  error?: string;
};

async function resolveTraineeId(explicitTraineeId?: string | null) {
  const session = await getSession();
  if (!session) redirect("/login");

  if (explicitTraineeId) {
    // רק מאמן/מנהל רשאים להזין מדד בשם חניך אחר
    if (session.role === "TRAINEE") redirect("/app");
    return explicitTraineeId;
  }

  const profile = await prisma.traineeProfile.findUnique({
    where: { userId: session.userId },
    select: { id: true },
  });
  if (!profile) redirect("/login");
  return profile.id;
}

export async function addMetricEntryAction(
  _prevState: MetricEntryState,
  formData: FormData,
): Promise<MetricEntryState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const traineeIdParam = formData.get("traineeId")?.toString() || null;
  const traineeId = await resolveTraineeId(traineeIdParam);

  const parsed = metricEntrySchema.safeParse({
    metricId: formData.get("metricId"),
    value: formData.get("value"),
    recordedAt: formData.get("recordedAt"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  await prisma.metricEntry.create({
    data: {
      traineeId,
      metricId: parsed.data.metricId,
      value: parsed.data.value,
      recordedAt: new Date(parsed.data.recordedAt),
      note: parsed.data.note,
      enteredById: session.userId,
    },
  });

  revalidatePath("/app");
  revalidatePath(`/admin/trainees/${traineeId}`);

  if (traineeIdParam) {
    redirect(`/admin/trainees/${traineeId}`);
  }
  redirect("/app");
}
