"use client"

import { useState, useEffect } from "react"
import type { SkinAnalysisData } from "@/types/skin-analysis"

interface UseSkinHistoryReturn {
  previousAnalyses: SkinAnalysisData[]
  previousImages: string[]
  addAnalysis: (analysis: SkinAnalysisData, image: string) => void
  clearHistory: () => void
  hasHistory: boolean
}

export function useSkinHistory(maxEntries = 5): UseSkinHistoryReturn {
  const [previousAnalyses, setPreviousAnalyses] = useState<SkinAnalysisData[]>([])
  const [previousImages, setPreviousImages] = useState<string[]>([])

  // Load previous analyses from localStorage on component mount
  useEffect(() => {
    try {
      const savedAnalyses = localStorage.getItem("skinAnalyses")
      const savedImages = localStorage.getItem("skinImages")

      if (savedAnalyses) {
        setPreviousAnalyses(JSON.parse(savedAnalyses))
      }

      if (savedImages) {
        setPreviousImages(JSON.parse(savedImages))
      }
    } catch (error) {
      console.error("Error loading previous analyses:", error)
    }
  }, [])

  const addAnalysis = (analysis: SkinAnalysisData, image: string) => {
    try {
      const updatedAnalyses = [...previousAnalyses, analysis]
      const updatedImages = [...previousImages, image]

      // Limit history to maxEntries
      if (updatedAnalyses.length > maxEntries) {
        updatedAnalyses.shift()
        updatedImages.shift()
      }

      setPreviousAnalyses(updatedAnalyses)
      setPreviousImages(updatedImages)

      localStorage.setItem("skinAnalyses", JSON.stringify(updatedAnalyses))
      localStorage.setItem("skinImages", JSON.stringify(updatedImages))
    } catch (error) {
      console.error("Error saving analysis history:", error)
    }
  }

  const clearHistory = () => {
    localStorage.removeItem("skinAnalyses")
    localStorage.removeItem("skinImages")
    setPreviousAnalyses([])
    setPreviousImages([])
  }

  return {
    previousAnalyses,
    previousImages,
    addAnalysis,
    clearHistory,
    hasHistory: previousAnalyses.length > 0,
  }
}

