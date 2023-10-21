import { Outlet, useNavigation } from "@remix-run/react";
import DefaultLayout from "~/components/layouts/default";
import Loading from "~/components/loading";

export default function Dashboard() {
  const navigation = useNavigation();

  return (
    <>
      <Loading
        isLoading={
          navigation.state === "submitting" || navigation.state === "loading"
        }
      />

      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </>
  );
}
