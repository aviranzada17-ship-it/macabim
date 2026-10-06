import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";

const SESSION_COOKIE = "mechabim_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 יום

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET חסר או קצר מדי. יש להגדיר משתנה סביבה AUTH_SECRET.",
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  username: string;
  fullName: string;
  role: Role;
  mustChangePassword: boolean;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      fullName: payload.fullName as string,
      role: payload.role as Role,
      mustChangePassword: payload.mustChangePassword as boolean,
    };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
