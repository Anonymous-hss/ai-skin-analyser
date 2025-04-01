"use client"

import { useRef, useState, useEffect } from "react"
import Webcam from "react-webcam"

function ImageCapture({ onCapture, capturedImage }) {
  const webcamRef = useRef(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const startCamera = () => {
    setIsCameraActive(true)
  }

  const captureImage = () => {
    if (!webcamRef.current) return

    const imageSrc = webcamRef.current.getScreenshot()
    onCapture(imageSrc)
    setIsCameraActive(false)
  }

  const retakeImage = () => {
    onCapture(null)
    setIsCameraActive(true)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        setIsCameraActive(false)
      }
    }
  }, [isCameraActive])

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="aspect-[4/3] relative">
        {isCameraActive ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-3/4 border-4 rounded-full border-dashed border-white opacity-70"></div>
            </div>
          </>
        ) : capturedImage ? (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured face" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">No image captured</p>
          </div>
        )}
      </div>

      <div className="p-4 flex justify-center">
        {!isCameraActive && !capturedImage && (
          <button onClick={startCamera} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Start Camera
          </button>
        )}

        {isCameraActive && (
          <button onClick={captureImage} className="px-4 py-2 bg-green-500 text-white rounded-md">
            Capture
          </button>
        )}

        {capturedImage && (
          <button onClick={retakeImage} className="px-4 py-2 bg-gray-500 text-white rounded-md">
            Retake
          </button>
        )}
      </div>
    </div>
  )
}

export default ImageCapture

