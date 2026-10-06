"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createTraineeSchema } from "@/lib/validation";
import { generateTempPassword } from "@/lib/generate";
import { hashPassword } from "@/lib/auth";

export type CreateTraineeState = {
  error?: string;
  success?: {
    username: string;
    tempPassword: string;
    traineeId: string;
    fullName: string;
  };
};

export async function createTraineeAction(
  _prevState: CreateTraineeState,
  formData: FormData,
): Promise<CreateTraineeState> {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  const parsed = createTraineeSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    groupId: formData.get("groupId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  }

  const { firstName, lastName, username, groupId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: `שם המשתמש "${username}" כבר תפוס, יש לבחור שם אחר` };
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      role: "TRAINEE",
      fullName: `${firstName} ${lastName}`,
      mustChangePassword: true,
      traineeProfile: {
        create: {
          lastName,
          groupId: groupId || undefined,
          onboardingCompleted: false,
        },
      },
    },
    include: { traineeProfile: true },
  });

  revalidatePath("/admin");

  return {
    success: {
      username: user.username,
      tempPassword,
      traineeId: user.traineeProfile!.id,
      fullName: user.fullName,
    },
  };
}

export type ResetPasswordState = {
  error?: string;
  tempPassword?: string;
};

export async function resetTraineePasswordAction(
  traineeUserId: string,
): Promise<ResetPasswordState> {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  await prisma.user.update({
    where: { id: traineeUserId },
    data: { passwordHash, mustChangePassword: true },
  });

  return { tempPassword };
}

export async function setTraineeActiveAction(
  traineeUserId: string,
  active: boolean,
) {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  await prisma.user.update({
    where: { id: traineeUserId },
    data: { active },
  });

  revalidatePath("/admin");
}

export async function deleteTraineeAction(traineeUserId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  await prisma.$transaction([
    prisma.metricEntry.deleteMany({ where: { enteredById: traineeUserId } }),
    prisma.coachNote.deleteMany({ where: { authorId: traineeUserId } }),
    prisma.user.delete({ where: { id: traineeUserId } }),
  ]);

  revalidatePath("/admin");
  redirect("/admin");
}

export async function assignGroupAction(
  traineeProfileId: string,
  groupId: string | null,
) {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") redirect("/login");

  await prisma.traineeProfile.update({
    where: { id: traineeProfileId },
    data: { groupId },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/trainees/${traineeProfileId}`);
}
