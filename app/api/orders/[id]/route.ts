import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"
import { firebaseDb } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decodedToken = await adminAuth.verifyIdToken(token)
    const businessId = decodedToken.uid

    const orderId = params.id
    if (!orderId) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    const order = await firebaseDb.getOrderById(orderId, businessId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const orderItems = await firebaseDb.getOrderItems(orderId)

    return NextResponse.json({
      order: {
        ...order,
        items: orderItems,
      },
    })
  } catch (error: any) {
    if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }
    console.error("Order fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
