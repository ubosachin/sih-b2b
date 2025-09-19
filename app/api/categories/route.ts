import { NextResponse } from "next/server"
import { firebaseDb } from "@/lib/database"

export async function GET() {
  try {
    const categories = await firebaseDb.getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
