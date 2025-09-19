"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Leaf, Menu, ShoppingCart, Package, ClipboardList, Scan, LogOut, User, Home, X } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Cart", href: "/dashboard/cart", icon: ShoppingCart, showBadge: true },
  { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { name: "QR Scanner", href: "/dashboard/scanner", icon: Scan },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const { business, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchCartItemCount()
  }, [])

  const fetchCartItemCount = async () => {
    try {
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        setCartItemCount(data.cartItems?.length || 0)
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            } ${mobile ? "w-full" : ""}`}
            onClick={() => {
              if (mobile) setSidebarOpen(false)
            }}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
            {item.showBadge && cartItemCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
              >
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </Badge>
            )}
          </Link>
        )
      })}
    </>
  )

  const UserProfile = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? "border-t pt-4" : "border-t pt-4"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{business?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{business?.email}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden bg-transparent fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          {/* Mobile Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">HerbPortal</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <NavItems mobile={true} />
          </nav>

          {/* Mobile User Profile */}
          <div className="p-4">
            <UserProfile mobile={true} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6">
          <div className="flex h-16 shrink-0 items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">HerbPortal</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              <li>
                <div className="space-y-1">
                  <NavItems />
                </div>
              </li>
              <li className="mt-auto">
                <UserProfile />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm">
                      Dashboard
                    </Link>
                  </li>
                  {pathname !== "/dashboard" && (
                    <>
                      <span className="text-muted-foreground">/</span>
                      <li>
                        <span className="text-foreground text-sm font-medium capitalize">
                          {pathname.split("/").pop()?.replace("-", " ")}
                        </span>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Quick Cart Access */}
              <Link href="/dashboard/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </Badge>
                  )}
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </Link>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

              {/* Desktop User Profile */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">{business?.name}</p>
                  <p className="text-xs text-muted-foreground">{business?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
