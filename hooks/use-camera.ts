"use client"

import { useEffect, useRef, useState } from "react"

interface UseCameraOptions {
  facingMode?: "user" | "environment"
  width?: number
  height?: number
}

export function useCamera(options: UseCameraOptions = {}) {
  const { facingMode = "environment", width = 1280, height = 720 } = options

  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if camera is supported
    setIsSupported(
      typeof navigator !== "undefined" && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia,
    )
  }, [])

  const startCamera = async () => {
    if (!isSupported) {
      setError("Camera is not supported on this device")
      return false
    }

    try {
      setError(null)

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height },
        },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
        setIsActive(true)
        return true
      }
    } catch (err) {
      console.error("Camera access error:", err)
      setError("Unable to access camera. Please ensure camera permissions are granted.")
      return false
    }

    return false
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsActive(false)
  }

  const captureFrame = (): string | null => {
    if (!videoRef.current || !isActive) return null

    const canvas = document.createElement("canvas")
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext("2d")
    if (!context) return null

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/jpeg", 0.8)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return {
    videoRef,
    isActive,
    isSupported,
    error,
    startCamera,
    stopCamera,
    captureFrame,
  }
}
