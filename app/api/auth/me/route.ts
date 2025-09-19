// User authentication state is managed by Firebase Auth context
// This file can be removed or kept for backward compatibility

import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      error: "User authentication is now handled by Firebase Auth. Please use the client-side auth context.",
    },
    { status: 410 },
  )
}
