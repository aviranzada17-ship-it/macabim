import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/logout";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Ruler, Shield } from "lucide-react";

const NAV = [
  { href: "/admin", label: "חניכים", icon: LayoutDashboard },
  { href: "/admin/metrics", label: "מדדים", icon: Ruler },
  { href: "/admin/groups", label: "קבוצות", icon: Shield },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role === "TRAINEE") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/branding/logo-olive.png"
                alt="המכבים"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-extrabold tracking-tight">
                המכבים · ניהול
              </span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {NAV.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link href={item.href} className="flex items-center gap-1.5">
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
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
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-primary-foreground/10 px-4 py-1.5 sm:hidden">
          {NAV.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className="shrink-0 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href={item.href} className="flex items-center gap-1.5">
                <item.icon className="size-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
