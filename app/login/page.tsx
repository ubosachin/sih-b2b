import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Leaf } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <Leaf className="h-8 w-8" />
            HerbPortal
          </Link>
          <p className="mt-2 text-muted-foreground">Professional B2B Herb Trading Platform</p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{"Don't have an account? "}</span>
          <Link href="/register" className="text-primary hover:underline font-medium">
            Register your business
          </Link>
        </div>
      </div>
    </div>
  )
}
