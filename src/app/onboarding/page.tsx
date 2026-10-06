import { redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session || session.role !== "TRAINEE") redirect("/login");

  const profile = await prisma.traineeProfile.findUnique({
    where: { userId: session.userId },
    select: { onboardingCompleted: true },
  });

  if (!profile) redirect("/login");
  if (profile.onboardingCompleted) redirect("/app");

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-8">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Image
          src="/branding/logo-navy.png"
          alt="המכבים"
          width={64}
          height={64}
        />
        <h1 className="text-lg font-extrabold text-foreground">
          ברוך הבא, {session.fullName.split(" ")[0]}!
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          לפני שמתחילים – כמה שאלות קצרות שיעזרו לנו להכיר אותך ולבנות עבורך
          את החוויה הכי טובה בתוכנית.
        </p>
      </div>

      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <OnboardingWizard />
      </div>
    </div>
  );
}
