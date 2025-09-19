"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Leaf, Award } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  unit: string
  stock_quantity: number
  min_order_quantity: number
  image_url: string
  organic_certified: boolean
  category_name: string
  farmer_name: string
  farm_name: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: number, quantity: number) => void
  loading?: boolean
}

export function ProductCard({ product, onAddToCart, loading }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product.id, product.min_order_quantity)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.organic_certified && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              <Leaf className="h-3 w-3 mr-1" />
              Organic
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">per {product.unit}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="h-3 w-3" />
            <span>
              {product.farmer_name} - {product.farm_name}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <Badge variant="secondary">{product.category_name}</Badge>
            <span className="text-muted-foreground">
              Stock: {product.stock_quantity} {product.unit}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            Min. order: {product.min_order_quantity} {product.unit}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={loading || product.stock_quantity < product.min_order_quantity}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
