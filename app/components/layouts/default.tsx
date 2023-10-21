import { useNavigation } from "@remix-run/react";
import Header from "~/components/layouts/header";
import Loading from "~/components/loading";
import Footer from "./footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerNavLinks = [
    { href: "/dashboard", title: "Overview" },
    { href: "/dashboard/leaderboard", title: "Leaderboard" },
    { href: "/dashboard/shop", title: "Shop" },
  ];

  const navigation = useNavigation();

  return (
    <>
      <Loading isLoading={navigation.state === "loading"} />

      <Header navigations={headerNavLinks} />
      {children}

      <Footer />
    </>
  );
}
