"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createGroupSchema } from "@/lib/validation";

export type GroupFormState = {
  error?: string;
};

export async function createGroupAction(
  _prevState: GroupFormState,
  formData: FormData,
): Promise<GroupFormState> {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  const parsed = createGroupSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  await prisma.group.create({ data: { name: parsed.data.name } });
  revalidatePath("/admin/groups");
  return {};
}

export async function renameGroupAction(
  groupId: string,
  _prevState: GroupFormState,
  formData: FormData,
): Promise<GroupFormState> {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  const parsed = createGroupSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  await prisma.group.update({
    where: { id: groupId },
    data: { name: parsed.data.name },
  });
  revalidatePath("/admin/groups");
  revalidatePath("/admin");
  return {};
}

export async function deleteGroupAction(groupId: string) {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  const traineeCount = await prisma.traineeProfile.count({
    where: { groupId },
  });

  if (traineeCount > 0) {
    return { error: "לא ניתן למחוק קבוצה שיש בה חניכים. יש לשייך אותם לקבוצה אחרת תחילה." };
  }

  await prisma.group.delete({ where: { id: groupId } });
  revalidatePath("/admin/groups");
  return {};
}
