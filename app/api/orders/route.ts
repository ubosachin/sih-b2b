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

    const orders = await firebaseDb.getOrdersByBusiness(businessId)
    return NextResponse.json({ orders })
  } catch (error: any) {
    if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }
    console.error("Orders fetch error:", error)
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
    const { shippingAddress, billingAddress, notes } = body

    const cartItems = await firebaseDb.getCartItems(businessId)
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    let totalAmount = 0
    const orderItemsData = []

    for (const cartItem of cartItems) {
      const product = await firebaseDb.getProductById(cartItem.productId)
      if (product) {
        const itemTotal = product.price * cartItem.quantity
        totalAmount += itemTotal
        orderItemsData.push({
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal,
        })
      }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${businessId.slice(-6)}`

    const order = await firebaseDb.createOrder({
      businessId,
      orderNumber,
      totalAmount,
      status: "pending",
      shippingAddress,
      billingAddress,
      notes,
    })

    await firebaseDb.addOrderItems(order.id!, orderItemsData)

    await firebaseDb.clearCart(businessId)

    return NextResponse.json({
      order,
      message: "Order placed successfully",
    })
  } catch (error: any) {
    if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
