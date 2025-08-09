"use client";

import { usePathname } from "next/navigation";
import { MobileHeader } from "./MobileHeader";
import { BottomNavigation } from "./BottomNavigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <MobileHeader />
      <main className={isHomePage ? "pb-20" : "flex-1 pb-20"}>{children}</main>
      <BottomNavigation />
    </>
  );
}
