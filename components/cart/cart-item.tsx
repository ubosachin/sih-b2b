"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, Leaf } from "lucide-react"
import { useState } from "react"

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

interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
  loading?: boolean
}

export function CartItemComponent({ item, onUpdateQuantity, onRemove, loading }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > item.stock_quantity) return

    setQuantity(newQuantity)
    onUpdateQuantity(item.product_id, newQuantity)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1
    handleQuantityChange(value)
  }

  const subtotal = item.price * quantity

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover rounded-md"
              sizes="64px"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">per {item.unit}</span>
              <Badge variant="secondary" className="text-xs">
                <Leaf className="h-3 w-3 mr-1" />
                Organic
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Stock: {item.stock_quantity} {item.unit}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={loading || quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              className="w-16 h-8 text-center"
              min="1"
              max={item.stock_quantity}
              disabled={loading}
            />

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={loading || quantity >= item.stock_quantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Subtotal */}
          <div className="text-right min-w-0">
            <p className="font-semibold text-foreground">${subtotal.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {quantity} {item.unit}
            </p>
          </div>

          {/* Remove Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive bg-transparent"
            onClick={() => onRemove(item.product_id)}
            disabled={loading}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
