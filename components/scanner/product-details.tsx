"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, Award, Calendar, MapPin, FileText, Shield, CheckCircle, Clock, User, Building, Mail } from "lucide-react"

interface ProductDetails {
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

interface ProductDetailsProps {
  product: ProductDetails
  onAddToCart?: () => void
  loading?: boolean
}

export function ProductDetails({ product, onAddToCart, loading }: ProductDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isExpiringSoon = () => {
    const expiryDate = new Date(product.expiry_date)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }

  return (
    <div className="space-y-6">
      {/* Authenticity Verification */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800">Product Verified</h3>
              <p className="text-sm text-green-600">
                Scanned via {product.authenticity.scanType.toUpperCase()} on{" "}
                {new Date(product.authenticity.scanTimestamp).toLocaleString()}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Authentic
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24 flex-shrink-0">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                sizes="96px"
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription className="mt-2">{product.description}</CardDescription>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">{product.category_name}</Badge>
                {product.organic_certified && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">per {product.unit}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batch Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Batch Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch Number:</span>
              <span className="font-mono font-medium">{product.batch_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Harvest Date:</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(product.harvest_date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expiry Date:</span>
              <span className={`flex items-center gap-1 ${isExpiringSoon() ? "text-orange-600" : ""}`}>
                <Clock className="h-4 w-4" />
                {formatDate(product.expiry_date)}
                {isExpiringSoon() && (
                  <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                    Expires Soon
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">QR Code:</span>
              <span className="font-mono text-sm">{product.qr_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Barcode:</span>
              <span className="font-mono text-sm">{product.barcode}</span>
            </div>
          </CardContent>
        </Card>

        {/* Farmer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Farmer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Farmer:</span>
              <span className="font-medium">{product.farmer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Farm:</span>
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {product.farm_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {product.farmer_location}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact:</span>
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {product.farmer_email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certification:</span>
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                {product.certification_type}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Farmer Bio */}
      {product.farmer_bio && (
        <Card>
          <CardHeader>
            <CardTitle>About the Farmer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.farmer_bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Lab Report */}
      {product.lab_report_url && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lab Report & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Quality Assurance Report</p>
                <p className="text-sm text-muted-foreground">Detailed lab analysis and certification documents</p>
              </div>
              <Button variant="outline" asChild>
                <a href={product.lab_report_url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  View Report
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add to Cart */}
      {onAddToCart && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={onAddToCart} disabled={loading} size="lg" className="w-full">
              {loading ? "Adding to Cart..." : "Add to Cart"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
