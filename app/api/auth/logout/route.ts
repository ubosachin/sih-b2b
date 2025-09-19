// Logout is now handled client-side with Firebase Auth
// This file can be removed or kept for backward compatibility

import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      error: "Logout is now handled by Firebase Auth. Please use the client-side logout.",
    },
    { status: 410 },
  )
}
