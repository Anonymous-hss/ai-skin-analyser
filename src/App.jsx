"use client"

import { useState, useRef } from "react"
import Header from "./components/Header"
import ImageCapture from "./components/ImageCapture"
import SkinAnalysis from "./components/SkinAnalysis"
import FacialHeatmap from "./components/FacialHeatmap"
import { analyzeSkin } from "./utils/skinAnalysisService"
import { generateReport } from "./utils/reportGenerator"

function App() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const [showResults, setShowResults] = useState(false)

  const heatmapRef = useRef(null)

  const handleCapture = (imageDataUrl) => {
    setCapturedImage(imageDataUrl)
  }

  const handleAnalyze = async () => {
    if (!capturedImage) return

    setIsLoading(true)
    try {
      const results = await analyzeSkin(capturedImage)
      setAnalysisData(results)
      setShowResults(true)
    } catch (error) {
      console.error("Error during analysis:", error)
      alert("Error analyzing image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!analysisData || !heatmapRef.current) return

    try {
      await generateReport(analysisData, heatmapRef.current, userName || "User")
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Error generating report. Please try again.")
    }
  }

  const handleReset = () => {
    setCapturedImage(null)
    setAnalysisData(null)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">AI Skin Analyzer</h1>

        {!showResults ? (
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="userName" className="block text-sm font-medium mb-1">
                Your Name (for the report)
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your name"
              />
            </div>

            <ImageCapture onCapture={handleCapture} capturedImage={capturedImage} />

            {capturedImage && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
                >
                  {isLoading ? "Analyzing..." : "Analyze Skin"}
                </button>
              </div>
            )}

            {isLoading && (
              <div className="mt-4 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full loading-spinner"></div>
                <p className="mt-2">Analyzing your skin...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex justify-end">
              <button onClick={handleReset} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">
                Start Over
              </button>
              <button onClick={handleDownloadReport} className="px-4 py-2 bg-green-500 text-white rounded-md">
                Download Report
              </button>
            </div>

            <div ref={heatmapRef}>
              <FacialHeatmap imageUrl={capturedImage} analysisData={analysisData} />
            </div>

            <SkinAnalysis analysisData={analysisData} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App

