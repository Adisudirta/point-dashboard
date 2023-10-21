import { db, authAdmin } from "~/plugins/firebase.admin";
import { authClient } from "~/plugins/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthPayload, type Role, type Member } from "./user.entity";
import { FieldValue } from "firebase-admin/firestore";
import { destroyUserSession, requireUser } from "./user.session";
import { redirect } from "@remix-run/node";

const collection = db.collection("members");

async function register(body: AuthPayload, role: Role) {
  const user = await authAdmin.createUser(body);
  await authAdmin.setCustomUserClaims(user.uid, { role: role });

  await collection.doc(user.uid).create({
    displayName: body.name,
    email: body.email,
    currentPoint: 0,
    reachedPoint: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}
async function login(body: AuthPayload) {
  const { user } = await signInWithEmailAndPassword(
    authClient,
    body.email,
    body.password
  );
  const idToken = await user.getIdToken();

  return idToken;
}

async function logout(request: Request) {
  try {
    const user = await requireUser(request);
    await authAdmin.revokeRefreshTokens(user.auth.sub);

    await destroyUserSession(request);

    return redirect("/");
  } catch (error) {
    return error;
  }
}

async function getUserById(id: string) {
  const res = await collection.doc(id).get();

  const data = res.data();
  if (!data) {
    return undefined;
  }

  return { id: res.id, ...res.data() } as Member;
}

export { register, login, logout, getUserById };
