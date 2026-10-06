"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { metricDefinitionSchema } from "@/lib/validation";

export type MetricDefinitionState = {
  error?: string;
};

export async function createMetricAction(
  _prevState: MetricDefinitionState,
  formData: FormData,
): Promise<MetricDefinitionState> {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  const parsed = metricDefinitionSchema.safeParse({
    name: formData.get("name"),
    unit: formData.get("unit"),
    higherIsBetter: formData.get("higherIsBetter") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  const maxOrder = await prisma.metricDefinition.aggregate({
    _max: { sortOrder: true },
  });

  await prisma.metricDefinition.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/admin/metrics");
  return {};
}

export async function updateMetricAction(
  metricId: string,
  _prevState: MetricDefinitionState,
  formData: FormData,
): Promise<MetricDefinitionState> {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  const parsed = metricDefinitionSchema.safeParse({
    name: formData.get("name"),
    unit: formData.get("unit"),
    higherIsBetter: formData.get("higherIsBetter") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  await prisma.metricDefinition.update({
    where: { id: metricId },
    data: parsed.data,
  });

  revalidatePath("/admin/metrics");
  return {};
}

export async function toggleMetricActiveAction(metricId: string, active: boolean) {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  await prisma.metricDefinition.update({
    where: { id: metricId },
    data: { active },
  });

  revalidatePath("/admin/metrics");
  revalidatePath("/admin");
}
