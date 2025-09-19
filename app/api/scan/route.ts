import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"
import { firebaseDb } from "@/lib/database"

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
    const { code, type = "qr", location } = body

    if (!code) {
      return NextResponse.json({ error: "Scan code is required" }, { status: 400 })
    }

    let product
    if (type === "qr") {
      product = await firebaseDb.getProductByQRCode(code)
    } else if (type === "barcode") {
      product = await firebaseDb.getProductByBarcode(code)
    } else {
      return NextResponse.json({ error: 'Invalid scan type. Must be "qr" or "barcode"' }, { status: 400 })
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found for this code" }, { status: 404 })
    }

    await firebaseDb.recordProductScan({
      businessId,
      productId: product.id!,
      scanType: type,
      scanCode: code,
      location,
    })

    // Return full product details
    return NextResponse.json({
      success: true,
      product: {
        ...product,
        authenticity: {
          verified: true,
          scanTimestamp: new Date().toISOString(),
          scanType: type,
        },
      },
    })
  } catch (error: any) {
    if (error.code === "auth/id-token-expired" || error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    console.error("Scan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
