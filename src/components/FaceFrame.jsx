"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, X, Check } from "lucide-react"

export default function FaceFrame({ onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isFaceDetected, setIsFaceDetected] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraActive(true)

        // In a real app, we would implement face detection here
        // For demo purposes, we'll simulate face detection after a delay
        setTimeout(() => setIsFaceDetected(true), 1500)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCameraActive(false)
      setIsFaceDetected(false)
    }
  }

  // Capture image
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data URL
    const imageDataUrl = canvas.toDataURL("image/png")
    setCapturedImage(imageDataUrl)

    // Stop camera
    stopCamera()

    // Pass image to parent component
    if (onCapture) onCapture(imageDataUrl)
  }

  // Reset capture
  const resetCapture = () => {
    setCapturedImage(null)
    startCamera()
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />

          {capturedImage ? (
            // Show captured image
            <img src={capturedImage || "/placeholder.svg"} alt="Captured face" className="w-full h-full object-cover" />
          ) : (
            // Show camera feed
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

              {isCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Face frame overlay */}
                  <div className="relative w-3/4 h-3/4 border-4 rounded-full border-dashed border-white opacity-70">
                    {isFaceDetected && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Face detected
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          {!isCameraActive && !capturedImage && (
            <Button onClick={startCamera} className="flex items-center">
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          )}

          {isCameraActive && (
            <Button
              onClick={captureImage}
              disabled={!isFaceDetected}
              className="flex items-center"
              variant={isFaceDetected ? "default" : "outline"}
            >
              <Check className="mr-2 h-4 w-4" />
              Capture
            </Button>
          )}

          {capturedImage && (
            <Button onClick={resetCapture} variant="outline" className="flex items-center">
              <X className="mr-2 h-4 w-4" />
              Retake
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

