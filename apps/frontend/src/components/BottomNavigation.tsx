"use client";

import { Home, Search, Calendar, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigationItems = [
  {
    name: "Trang chủ",
    href: "/",
    icon: Home,
    color: "text-orange-500",
  },
  {
    name: "Tìm kiếm",
    href: "/explore",
    icon: Search,
    color: "text-orange-500",
  },
  {
    name: "Lịch trình",
    href: "/planner",
    icon: Calendar,
    color: "text-orange-500",
  },
  {
    name: "Ví",
    href: "/wallet",
    icon: CreditCard,
    color: "text-orange-500",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center py-2 px-1"
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive ? "bg-orange-500" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? "text-orange-500 font-medium" : "text-gray-600"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
