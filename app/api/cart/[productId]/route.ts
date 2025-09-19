import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"
import { firebaseDb } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decodedToken = await adminAuth.verifyIdToken(token)
    const businessId = decodedToken.uid

    const productId = params.productId
    if (!productId) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const body = await request.json()
    const { quantity } = body

    if (!quantity || quantity < 0) {
      return NextResponse.json({ error: "Valid quantity is required" }, { status: 400 })
    }

    const cartItem = await firebaseDb.updateCartItem(businessId, productId, quantity)
    return NextResponse.json({ cartItem, message: "Cart updated" })
  } catch (error: any) {
    if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decodedToken = await adminAuth.verifyIdToken(token)
    const businessId = decodedToken.uid

    const productId = params.productId
    if (!productId) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    await firebaseDb.removeFromCart(businessId, productId)
    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error: any) {
    if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }
    console.error("Remove from cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
