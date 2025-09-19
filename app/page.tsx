import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Shield, Scan, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-primary">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8" />
            HerbPortal
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="text-xs sm:text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance leading-tight">
            Professional B2B Herb Trading Platform
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 text-pretty max-w-3xl mx-auto">
            Connect with verified herb suppliers, manage orders seamlessly, and ensure product authenticity with our
            advanced QR scanning technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Register Your Business
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
            Why Choose HerbPortal?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="h-full">
              <CardHeader className="text-center pb-4">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">B2B Focused</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  Designed specifically for business-to-business herb trading with professional features.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="text-center pb-4">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">Quality Assured</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  All herbs come with lab reports, certifications, and detailed farmer information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="text-center pb-4">
                <Scan className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">QR Verification</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  Scan QR codes to instantly verify product authenticity and access detailed information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="text-center pb-4">
                <Leaf className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">Organic Focus</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  Specializing in organic and sustainably sourced herbs from certified farmers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-base sm:text-lg font-semibold text-foreground">HerbPortal</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            © 2024 HerbPortal. Professional B2B Herb Trading Platform.
          </p>
        </div>
      </footer>
    </div>
  )
}
