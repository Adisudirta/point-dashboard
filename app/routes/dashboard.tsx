import { Outlet } from "@remix-run/react";
import DefaultLayout from "~/components/layouts/default";

export default function Dashboard() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}
