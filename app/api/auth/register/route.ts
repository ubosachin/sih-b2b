// Registration is now handled client-side with Firebase Auth
// This file can be removed or kept for backward compatibility

import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      error: "Registration is now handled by Firebase Auth. Please use the client-side registration.",
    },
    { status: 410 },
  )
}
