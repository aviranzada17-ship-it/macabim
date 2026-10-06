import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "mechabim_session";

type Role = "ADMIN" | "COACH" | "TRAINEE";

async function readSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return {
      role: payload.role as Role,
      mustChangePassword: payload.mustChangePassword as boolean,
    };
  } catch {
    return null;
  }
}

function homeFor(role: Role) {
  return role === "TRAINEE" ? "/app" : "/admin";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/branding") ||
    pathname === "/favicon.ico";

  const session = await readSession(req);

  if (!session) {
    if (isPublic) return NextResponse.next();
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // משתמש מחובר שמנסה להגיע לעמוד ההתחברות או ההרשמה -> נעביר אותו הביתה
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(new URL(homeFor(session.role), req.url));
  }

  // חובה להחליף סיסמה לפני כל שימוש אחר במערכת
  if (session.mustChangePassword && pathname !== "/change-password") {
    return NextResponse.redirect(new URL("/change-password", req.url));
  }

  // הפרדת אזורים לפי תפקיד
  if (pathname.startsWith("/admin") && session.role === "TRAINEE") {
    return NextResponse.redirect(new URL("/app", req.url));
  }
  if (pathname.startsWith("/app") && session.role !== "TRAINEE") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|branding|favicon.ico).*)",
  ],
};
