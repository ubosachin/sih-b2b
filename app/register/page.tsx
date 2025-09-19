import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { Leaf } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <Leaf className="h-8 w-8" />
            HerbPortal
          </Link>
          <p className="mt-2 text-muted-foreground">Professional B2B Herb Trading Platform</p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}
