"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Webcam from "react-webcam"

interface ImageCaptureProps {
  onCapture: (imageDataUrl: string) => void
  capturedImage: string | null
}

export default function ImageCapture({ onCapture, capturedImage }: ImageCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = () => {
    setIsCameraActive(true)
    setUploadedImage(null)
  }

  const handleCameraReady = () => {
    setIsCameraReady(true)
  }

  const captureImage = useCallback(() => {
    if (!webcamRef.current) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
      setIsCameraActive(false)
    }
  }, [webcamRef, onCapture])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setUploadedImage(result)
      onCapture(result)
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md aspect-[3/4] relative rounded-lg overflow-hidden bg-secondary-100 mb-4">
        {isCameraActive ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "user",
                width: 720,
                height: 960,
              }}
              onUserMedia={handleCameraReady}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-3/4 border-4 rounded-full border-dashed border-white opacity-70"></div>
            </div>
          </>
        ) : uploadedImage || capturedImage ? (
          <img src={uploadedImage || capturedImage || ""} alt="Captured face" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-secondary-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-secondary-500 text-center">
              Take a photo or upload an image to begin your skin analysis
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {!isCameraActive && !uploadedImage && !capturedImage && (
          <>
            <button onClick={startCamera} className="btn btn-primary flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Start Camera
            </button>

            <button onClick={triggerFileInput} className="btn btn-outline flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload Image
            </button>

            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          </>
        )}

        {isCameraActive && (
          <button onClick={captureImage} disabled={!isCameraReady} className="btn btn-primary flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
            </svg>
            Capture
          </button>
        )}

        {(uploadedImage || capturedImage) && (
          <button
            onClick={() => {
              setUploadedImage(null)
              setIsCameraActive(false)
            }}
            className="btn btn-outline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retake
          </button>
        )}
      </div>
    </div>
  )
}

