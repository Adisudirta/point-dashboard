import { redirect } from "@remix-run/node";
import { logout } from "~/models/user/user.server";

export async function loader({ request }: { request: Request }) {
  await logout(request);
  return redirect("/");
}

export function Logout() {
  return <></>;
}
