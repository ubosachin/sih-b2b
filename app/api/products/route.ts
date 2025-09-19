import { type NextRequest, NextResponse } from "next/server"
import { firebaseDb } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const categoryId = searchParams.get("categoryId")

    const products = await firebaseDb.getProducts(limit, categoryId || undefined)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        hasMore: products.length === limit,
      },
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
