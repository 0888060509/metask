
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/app-header"

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Profile", href: "/dashboard/settings" },
    { name: "Appearance", href: "/dashboard/settings/appearance" },
    { name: "Notifications", href: "/dashboard/settings/notifications" },
  ]

  return (
    <div className="flex h-full flex-col">
        <AppHeader title="Settings" />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
                <nav className="grid gap-1 text-sm text-muted-foreground md:col-span-1">
                    {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                        "px-4 py-2 rounded-lg hover:bg-muted hover:text-foreground",
                        pathname === item.href && "bg-muted font-semibold text-foreground"
                        )}
                    >
                        {item.name}
                    </Link>
                    ))}
                </nav>
                <main className="md:col-span-3">{children}</main>
            </div>
        </div>
    </div>
  )
}

export default SettingsLayout
