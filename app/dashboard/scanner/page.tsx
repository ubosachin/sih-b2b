"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QRScanner } from "@/components/scanner/qr-scanner"
import { ProductDetails } from "@/components/scanner/product-details"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Scan, ArrowLeft, Loader2, AlertCircle } from "lucide-react"

interface ScannedProduct {
  id: number
  name: string
  description: string
  price: number
  unit: string
  batch_number: string
  harvest_date: string
  expiry_date: string
  organic_certified: boolean
  lab_report_url: string
  qr_code: string
  barcode: string
  image_url: string
  category_name: string
  farmer_name: string
  farm_name: string
  farmer_location: string
  farmer_email: string
  certification_type: string
  farmer_bio: string
  authenticity: {
    verified: boolean
    scanTimestamp: string
    scanType: "qr" | "barcode"
  }
}

export default function ScannerPage() {
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const { toast } = useToast()

  const handleScanResult = async (code: string, type: "qr" | "barcode") => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          type,
          location: "Dashboard Scanner", // Optional location info
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setScannedProduct(data.product)
        toast({
          title: "Product Scanned Successfully",
          description: `Found ${data.product.name} - ${type.toUpperCase()} verified`,
        })
      } else {
        setError(data.error)
        toast({
          title: "Scan Failed",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = "Failed to scan product. Please try again."
      setError(errorMessage)
      toast({
        title: "Scan Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!scannedProduct) return

    try {
      setAddingToCart(true)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: scannedProduct.id,
          quantity: 1, // Default quantity
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Added to Cart",
          description: `${scannedProduct.name} has been added to your cart`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const handleNewScan = () => {
    setScannedProduct(null)
    setError(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">QR & Barcode Scanner</h1>
            <p className="text-muted-foreground">
              Scan product codes to verify authenticity and view detailed information
            </p>
          </div>
          {scannedProduct && (
            <Button onClick={handleNewScan} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!scannedProduct ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scanner */}
            <div>
              <QRScanner onScanResult={handleScanResult} loading={loading} />
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    How to Use
                  </CardTitle>
                  <CardDescription>Follow these steps to scan and verify products</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Start Camera</p>
                        <p className="text-sm text-muted-foreground">
                          Click "Start Camera" to activate your device's camera
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Position Code</p>
                        <p className="text-sm text-muted-foreground">
                          Align the QR code or barcode within the scanning frame
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>
                        <p className="font-medium">View Results</p>
                        <p className="text-sm text-muted-foreground">
                          Get instant verification and detailed product information
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What You'll See</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Product authenticity verification</li>
                    <li>• Detailed batch and harvest information</li>
                    <li>• Farmer and farm details</li>
                    <li>• Certification and lab reports</li>
                    <li>• Expiry dates and quality metrics</li>
                    <li>• Option to add verified products to cart</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Verifying product...</span>
              </div>
            ) : (
              <ProductDetails product={scannedProduct} onAddToCart={handleAddToCart} loading={addingToCart} />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
