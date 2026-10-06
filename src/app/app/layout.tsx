import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/logout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default async function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "TRAINEE") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/app" className="flex items-center gap-2">
            <Image
              src="/branding/logo-olive.png"
              alt="המכבים"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-extrabold tracking-tight">המכבים</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-primary-foreground/80 sm:inline">
              {session.fullName}
            </span>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                aria-label="התנתקות"
              >
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
