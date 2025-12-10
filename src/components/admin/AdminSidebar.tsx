"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: "🏠" },
  { name: "Categories", href: "/admin/categories", icon: "📁" },
  { name: "Submissions", href: "/admin/submissions", icon: "📝" },
  { name: "Judges", href: "/admin/judges", icon: "👥" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-midnight-900/50 backdrop-blur-xl border-r border-white/5">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-finder-400 to-finder-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <span className="font-display font-bold text-lg block">Finder Force</span>
            <span className="text-xs text-white/40">Admin Panel</span>
          </div>
        </Link>
      </div>

      <nav className="px-4 mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
                isActive
                  ? "bg-finder-500/20 text-finder-400 border border-finder-500/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="p-4 bg-gradient-to-br from-finder-500/20 to-finder-600/10 rounded-2xl border border-finder-500/20">
          <p className="text-sm text-white/70 mb-2">Finder Force v1.0</p>
          <p className="text-finder-400 text-xs">Awards Platform</p>
        </div>
      </div>
    </aside>
  );
}

