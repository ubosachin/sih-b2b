"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Package, ShoppingCart, ClipboardList, Scan } from "lucide-react"

interface MobileNavProps {
  cartItemCount?: number
}

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Cart", href: "/dashboard/cart", icon: ShoppingCart, showBadge: true },
  { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { name: "Scanner", href: "/dashboard/scanner", icon: Scan },
]

export function MobileNav({ cartItemCount = 0 }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
      <nav className="flex items-center justify-around py-2 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full flex flex-col items-center gap-1 h-auto py-2 relative ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
                {item.showBadge && cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
