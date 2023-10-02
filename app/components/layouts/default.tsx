import { Outlet, useNavigation } from "@remix-run/react";
import Header from "~/components/header";
import Loading from "~/components/loading";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerNavLinks = [
    { href: "/", title: "Overview" },
    { href: "/leaderboard", title: "Leaderboard" },
    { href: "/shop", title: "Shop" },
  ];

  const navigation = useNavigation();

  return (
    <>
      <Loading isLoading={navigation.state === "loading"} />

      <Header navigations={headerNavLinks} />
      {children}
    </>
  );
}
