"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CartItemComponent } from "@/components/cart/cart-item"
import { CheckoutForm } from "@/components/orders/checkout-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: number
  product_id: number
  quantity: number
  name: string
  price: number
  image_url: string
  unit: string
  stock_quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart")
      const data = await response.json()

      if (response.ok) {
        setCartItems(data.cartItems)
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart items. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      setUpdating(productId)
      const response = await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      const data = await response.json()

      if (response.ok) {
        setCartItems((prev) => prev.map((item) => (item.product_id === productId ? { ...item, quantity } : item)))
        toast({
          title: "Cart Updated",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      setUpdating(productId)
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.product_id !== productId))
        toast({
          title: "Item Removed",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleOrderComplete = () => {
    setShowCheckout(false)
    setCartItems([])
    router.push("/dashboard/orders")
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading cart...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (showCheckout) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowCheckout(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
              <p className="text-muted-foreground">Complete your order</p>
            </div>
          </div>

          <CheckoutForm cartItems={cartItems} onOrderComplete={handleOrderComplete} />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Link href="/dashboard/products">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">Your cart is empty</CardTitle>
              <CardDescription className="text-center mb-6">
                Browse our product catalog and add some herbs to your cart.
              </CardDescription>
              <Link href="/dashboard/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  loading={updating === item.product_id}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-semibold">${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">{total > 100 ? "Free" : "$15.00"}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-primary">
                        ${(total + total * 0.08 + (total > 100 ? 0 : 15)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  {total > 100 && <p className="text-sm text-primary text-center">🎉 You qualify for free shipping!</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
