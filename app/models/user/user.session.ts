import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authAdmin } from "~/plugins/firebase.admin";
import { getUserById } from "./user.server";
import { Role } from "./user.entity";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const TOKEN_SESSION_KEY = "token";

const ONE_DAY = 60 * 60 * 24;
const SEVEN_DAYS = ONE_DAY * 7;

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    secrets: [process.env.SESSION_SECRET],
    secure: true,
    maxAge: SEVEN_DAYS,
  },
});

const commitSession = sessionStorage.commitSession;

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  return session;
}

async function getUserToken(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  const token = session.get(TOKEN_SESSION_KEY);

  return token;
}

async function getUser(request: Request) {
  const token = await getUserToken(request);

  if (token === undefined) return null;

  try {
    const decodedToken = await authAdmin.verifySessionCookie(token, true);

    const detail = await getUserById(decodedToken.uid);

    if (!detail) return null;

    return { auth: decodedToken, detail };
  } catch {
    await destroyUserSession(request);
    throw "Invalid session";
  }
}

async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

  const token = await getUserToken(request);
  if (!token) {
    throw redirect(`/?${searchParams}`);
  }

  try {
    const decodedToken = await authAdmin.verifySessionCookie(token, true);

    const detail = await getUserById(decodedToken.uid);
    if (!detail) {
      throw redirect(`/?${searchParams}`);
    }

    return { auth: decodedToken, detail };
  } catch {
    throw await destroyUserSession(request);
  }
}

async function requireUserRole(request: Request, expectedRole: Role) {
  const user = await requireUser(request);

  if (user.auth.role !== expectedRole) {
    if (user.auth.role === "admin") throw redirect("/admin");
    else if (user.auth.role === "member") throw redirect("/dashboard");
  }

  return user;
}

async function createUserSession({
  request,
  token,
  remember,
  redirectTo,
}: {
  request: Request;
  token: string;
  remember: boolean;
  redirectTo: string;
}) {
  const tokenExpires = remember ? SEVEN_DAYS : ONE_DAY;
  const sessionCookieToken = await authAdmin.createSessionCookie(token, {
    expiresIn: tokenExpires * 1000, // In milliseconds
  });

  const session = await getSession(request);
  session.set(TOKEN_SESSION_KEY, sessionCookieToken);

  // Todo: Create a new CSRF token to avoid session fixation attacks
  // Refrence: https://owasp.org/www-community/attacks/Session_fixation

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

async function destroyUserSession(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export {
  getSession,
  commitSession,
  createUserSession,
  getUser,
  requireUser,
  requireUserRole,
  destroyUserSession,
};
