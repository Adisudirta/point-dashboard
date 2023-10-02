import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/models/user/user.server";

export async function action({ request }: ActionFunctionArgs) {
  const logRes = await logout(request);
  return logRes;
}

export function loader() {
  return redirect("/");
}
