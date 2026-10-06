"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { reflectionSchema } from "@/lib/validation";

export type ReflectionState = {
  error?: string;
};

export async function addReflectionAction(
  _prevState: ReflectionState,
  formData: FormData,
): Promise<ReflectionState> {
  const session = await getSession();
  if (!session || session.role !== "TRAINEE") redirect("/login");

  const profile = await prisma.traineeProfile.findUnique({
    where: { userId: session.userId },
    select: { id: true },
  });
  if (!profile) redirect("/login");

  const parsed = reflectionSchema.safeParse({
    keepPoint: formData.get("keepPoint"),
    improvePoint: formData.get("improvePoint"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  await prisma.reflectionEntry.create({
    data: {
      traineeId: profile.id,
      keepPoint: parsed.data.keepPoint,
      improvePoint: parsed.data.improvePoint,
    },
  });

  revalidatePath("/app");
  redirect("/app");
}
