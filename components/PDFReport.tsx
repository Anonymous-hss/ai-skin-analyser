"use client"

import { useState } from "react"
import type { SkinAnalysisData } from "@/types/skin-analysis"
import { Button } from "@/components/ui/button"
import { generateReport } from "@/lib/report-generator"

interface PDFReportProps {
  analysisData: SkinAnalysisData
  imageUrl: string
  userName: string
}

export default function PDFReport({ analysisData, imageUrl, userName }: PDFReportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setProgress(10)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 300)

      await generateReport(analysisData, document.getElementById("heatmap-container"), imageUrl, userName)

      clearInterval(progressInterval)
      setProgress(100)

      // Reset after completion
      setTimeout(() => {
        setIsGenerating(false)
        setProgress(0)
      }, 1000)
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Failed to generate report. Please try again.")
      setIsGenerating(false)
      setProgress(0)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-serif font-semibold text-primary-800 mb-3">Download Your Analysis Report</h3>

      <p className="text-sm text-secondary-600 mb-4">
        Get a detailed PDF report of your skin analysis that you can save, print, or share with your dermatologist.
      </p>

      {isGenerating ? (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-secondary-500 text-center">
            {progress < 30
              ? "Preparing report..."
              : progress < 60
                ? "Generating visualizations..."
                : progress < 90
                  ? "Finalizing document..."
                  : "Downloading report..."}
          </p>
        </div>
      ) : (
        <Button onClick={handleGenerateReport} className="w-full flex items-center justify-center">
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Generate PDF Report
        </Button>
      )}

      <div className="mt-4 text-xs text-secondary-500">
        <p>The report includes:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Detailed skin condition analysis</li>
          <li>Facial heatmap visualization</li>
          <li>Personalized product recommendations</li>
          <li>Skincare routine suggestions</li>
        </ul>
      </div>
    </div>
  )
}

