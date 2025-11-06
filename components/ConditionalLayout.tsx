"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes: no header/footer
    return <>{children}</>;
  }

  // Public routes: show header/footer
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
