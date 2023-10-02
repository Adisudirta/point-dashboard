import { db, authAdmin } from "~/plugins/firebase.admin";
import { authClient } from "~/plugins/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { User } from "./user.entity";
import { FieldValue } from "firebase-admin/firestore";

type Role = "admin" | "member";

const collection = db.collection("points");

async function register(body: User, role: Role) {
  const user = await authAdmin.createUser(body);
  await authAdmin.setCustomUserClaims(user.uid, { role: role });

  await collection
    .doc(user.uid)
    .create({ point: 0, updatedAt: FieldValue.serverTimestamp() });
}

async function login(body: User) {
  await signInWithEmailAndPassword(authClient, body.email, body.password);
}

export { type Role, register, login };
