"use client"

import { useRef, useEffect, useState } from "react"

const skinConditionColors = {
  acne: "rgba(255, 0, 0, 0.5)", // Red
  dryness: "rgba(255, 255, 0, 0.5)", // Yellow
  oiliness: "rgba(0, 255, 0, 0.5)", // Green
  wrinkles: "rgba(0, 0, 255, 0.5)", // Blue
  pigmentation: "rgba(255, 0, 255, 0.5)", // Purple
}

function FacialHeatmap({ imageUrl, analysisData }) {
  const canvasRef = useRef(null)
  const [heatmapGenerated, setHeatmapGenerated] = useState(false)

  useEffect(() => {
    if (!imageUrl || !analysisData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw the original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw heatmap overlays based on analysis data
      if (analysisData.regions) {
        analysisData.regions.forEach((region) => {
          const { x, y, width, height, condition, severity } = region

          // Set color based on condition type
          ctx.fillStyle = skinConditionColors[condition] || "rgba(255, 0, 0, 0.3)"

          // Adjust opacity based on severity (0-1)
          ctx.globalAlpha = severity * 0.7

          // Draw the region
          ctx.fillRect(x, y, width, height)
        })
      }

      // Reset global alpha
      ctx.globalAlpha = 1.0
      setHeatmapGenerated(true)
    }
  }, [imageUrl, analysisData])

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4">Skin Condition Heatmap</h3>

      <div className="relative">
        <canvas ref={canvasRef} className="w-full h-auto rounded-md border border-gray-200" />

        {!heatmapGenerated && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md">
            <p>Generating heatmap...</p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Object.entries(skinConditionColors).map(([condition, color]) => (
            <div key={condition} className="flex items-center">
              <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-sm capitalize">{condition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FacialHeatmap

