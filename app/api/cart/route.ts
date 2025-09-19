import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"
import { firebaseDb } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decodedToken = await adminAuth.verifyIdToken(token)
    const businessId = decodedToken.uid

    const cartItems = await firebaseDb.getCartItems(businessId)
    return NextResponse.json({ cartItems })
  } catch (error: any) {
    if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decodedToken = await adminAuth.verifyIdToken(token)
    const businessId = decodedToken.uid

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Product ID and valid quantity are required" }, { status: 400 })
    }

    const product = await firebaseDb.getProductById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (quantity < product.minOrderQuantity) {
      return NextResponse.json(
        { error: `Minimum order quantity is ${product.minOrderQuantity} ${product.unit}` },
        { status: 400 },
      )
    }

    if (product.stockQuantity < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    const cartItem = await firebaseDb.addToCart(businessId, productId, quantity)
    return NextResponse.json({ cartItem, message: "Item added to cart" })
  } catch (error: any) {
    if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
