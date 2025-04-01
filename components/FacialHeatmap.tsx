"use client"

import { useRef, useEffect, useState } from "react"
import type { SkinAnalysisData } from "@/types/skin-analysis"

interface FacialHeatmapProps {
  imageUrl: string
  analysisData: SkinAnalysisData
}

const skinConditionColors = {
  acne: "rgba(255, 0, 0, 0.5)", // Red
  dryness: "rgba(255, 255, 0, 0.5)", // Yellow
  oiliness: "rgba(0, 255, 0, 0.5)", // Green
  wrinkles: "rgba(0, 0, 255, 0.5)", // Blue
  pigmentation: "rgba(255, 0, 255, 0.5)", // Purple
  rosacea: "rgba(255, 105, 180, 0.5)", // Pink
  eczema: "rgba(255, 165, 0, 0.5)", // Orange
  psoriasis: "rgba(128, 0, 128, 0.5)", // Dark Purple
  melasma: "rgba(165, 42, 42, 0.5)", // Brown
  sensitivity: "rgba(0, 255, 255, 0.5)", // Cyan
}

export default function FacialHeatmap({ imageUrl, analysisData }: FacialHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null)
  const [heatmapGenerated, setHeatmapGenerated] = useState(false)

  useEffect(() => {
    if (!imageUrl || !analysisData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

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
        const regionsToRender = selectedCondition
          ? analysisData.regions.filter((region) => region.condition === selectedCondition)
          : analysisData.regions

        regionsToRender.forEach((region) => {
          const { x, y, width, height, condition, severity } = region

          // Set color based on condition type
          ctx.fillStyle = skinConditionColors[condition as keyof typeof skinConditionColors] || "rgba(255, 0, 0, 0.3)"

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
  }, [imageUrl, analysisData, selectedCondition])

  // Get unique conditions from regions
  const uniqueConditions = analysisData.regions
    ? Array.from(new Set(analysisData.regions.map((region) => region.condition)))
    : []

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h3 className="text-xl font-serif font-semibold text-primary-800 mb-4">Skin Condition Heatmap</h3>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCondition === null
                ? "bg-primary-500 text-white"
                : "bg-gray-200 text-secondary-700 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCondition(null)}
          >
            All Conditions
          </button>

          {uniqueConditions.map((condition, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCondition === condition
                  ? "bg-primary-500 text-white"
                  : "bg-gray-200 text-secondary-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedCondition(condition)}
            >
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} className="w-full h-auto rounded-md border border-gray-200" />

        {!heatmapGenerated && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md">
            <p>Generating heatmap...</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {Object.entries(skinConditionColors)
          .filter(
            ([condition]) =>
              !selectedCondition || selectedCondition === condition || uniqueConditions.includes(condition),
          )
          .map(([condition, color]) => (
            <div key={condition} className="flex items-center">
              <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-sm capitalize">{condition}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

