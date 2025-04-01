"use client"

import { useEffect, useState } from "react"
import type { SkinAnalysisData } from "@/types/skin-analysis"
import { analyzeSkin } from "@/lib/skin-analysis-service"

interface ScanningProcessProps {
  imageUrl: string
  onAnalysisComplete: (data: SkinAnalysisData) => void
  onError: (message: string) => void
}

export default function ScanningProcess({ imageUrl, onAnalysisComplete, onError }: ScanningProcessProps) {
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("Initializing analysis...")

  useEffect(() => {
    const analyzeImage = async () => {
      try {
        // Update progress and status message
        setProgress(10)
        setStatusMessage("Preparing image for analysis...")

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })

          // Update status messages based on progress
          setStatusMessage(getStatusMessage(progress))
        }, 1000)

        // Perform actual analysis
        const results = await analyzeSkin(imageUrl)

        // Clear interval and complete progress
        clearInterval(progressInterval)
        setProgress(100)
        setStatusMessage("Analysis complete!")

        // Short delay before showing results
        setTimeout(() => {
          onAnalysisComplete(results)
        }, 500)
      } catch (error) {
        console.error("Error during analysis:", error)
        onError("An error occurred during skin analysis. Please try again.")
      }
    }

    analyzeImage()
  }, [imageUrl, onAnalysisComplete, onError, progress])

  const getStatusMessage = (currentProgress: number) => {
    if (currentProgress < 20) return "Preparing image for analysis..."
    if (currentProgress < 40) return "Detecting facial features..."
    if (currentProgress < 60) return "Analyzing skin conditions..."
    if (currentProgress < 80) return "Generating recommendations..."
    return "Finalizing your personalized report..."
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md aspect-[3/4] relative rounded-lg overflow-hidden bg-secondary-100 mb-6">
        <img src={imageUrl || "/placeholder.svg"} alt="Analyzing face" className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
          <div className="scan-line"></div>

          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Analyzing...</span>
              <span className="text-sm">{progress}%</span>
            </div>

            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-accent-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-sm mt-2 text-gray-200">{statusMessage}</p>
          </div>
        </div>
      </div>

      <div className="text-center max-w-md">
        <h3 className="text-xl font-serif font-semibold text-primary-800 mb-2">AI Skin Analysis in Progress</h3>
        <p className="text-secondary-600">
          Our advanced AI is analyzing your skin for 10 different conditions and generating personalized
          recommendations.
        </p>
      </div>
    </div>
  )
}

