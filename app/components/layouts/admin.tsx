import { useNavigation } from "@remix-run/react";
import Loading from "../loading";
import Header from "./header";
import Footer from "./footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerNavLinks = [
    { href: "/admin", title: "Students" },
    { href: "/admin/reward-schema", title: "Reward Schema" },
    { href: "/admin/shop-management", title: "Shop Management" },
    { href: "/admin/notification", title: "Notifications" },
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
