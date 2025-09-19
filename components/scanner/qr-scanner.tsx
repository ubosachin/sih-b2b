"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, CameraOff, RotateCcw, Scan, AlertCircle } from "lucide-react"

interface QRScannerProps {
  onScanResult: (result: string, type: "qr" | "barcode") => void
  loading?: boolean
}

export function QRScanner({ onScanResult, loading }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      setError(null)

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
        setIsScanning(true)
        startScanning()
      }
    } catch (err) {
      console.error("Camera access error:", err)
      setError("Unable to access camera. Please ensure camera permissions are granted.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    if (isScanning) {
      stopCamera()
      setTimeout(() => startCamera(), 100)
    }
  }

  const startScanning = () => {
    const scanInterval = setInterval(() => {
      if (videoRef.current && canvasRef.current && isScanning) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          // In a real implementation, you would use a QR/barcode scanning library here
          // For demo purposes, we'll simulate scanning with manual input
          // Popular libraries: @zxing/library, quagga2, or jsQR
        }
      }
    }, 100)

    // Cleanup interval when component unmounts or scanning stops
    setTimeout(() => {
      if (!isScanning) {
        clearInterval(scanInterval)
      }
    }, 100)
  }

  // Simulate QR code scanning for demo
  const simulateQRScan = () => {
    const mockQRCodes = ["QR-TUR-001", "QR-BAS-002", "QR-LAV-003", "QR-CHA-004"]
    const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)]
    onScanResult(randomCode, "qr")
  }

  // Simulate barcode scanning for demo
  const simulateBarcodeScan = () => {
    const mockBarcodes = ["BC-789123456", "BC-789123457", "BC-789123458", "BC-789123459"]
    const randomCode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
    onScanResult(randomCode, "barcode")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          QR & Barcode Scanner
        </CardTitle>
        <CardDescription>Scan product codes to verify authenticity and view detailed information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Camera View */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {isScanning ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

                  {/* Scanning Line Animation */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary animate-pulse"></div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 text-white p-3 rounded-lg text-center">
                  <p className="text-sm">Position the QR code or barcode within the frame</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Camera not active</p>
                <p className="text-sm text-muted-foreground">Click "Start Camera" to begin scanning</p>
              </div>
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="flex flex-wrap gap-2">
          {!isScanning ? (
            <Button onClick={startCamera} disabled={loading}>
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" disabled={loading}>
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}

          <Button onClick={switchCamera} variant="outline" disabled={!isScanning || loading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Switch Camera
          </Button>
        </div>

        {/* Demo Buttons */}
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-3">Demo Mode (for testing):</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={simulateQRScan} variant="outline" size="sm" disabled={loading}>
              <Badge className="mr-2 bg-primary text-primary-foreground">QR</Badge>
              Simulate QR Scan
            </Button>
            <Button onClick={simulateBarcodeScan} variant="outline" size="sm" disabled={loading}>
              <Badge className="mr-2 bg-secondary text-secondary-foreground">BC</Badge>
              Simulate Barcode Scan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
