"use client"

import { useState, useRef } from "react"
import type { SkinAnalysisData } from "@/types/skin-analysis"
import FacialHeatmap from "@/components/FacialHeatmap"
import ConditionDetails from "@/components/ConditionDetails"
import Recommendations from "@/components/Recommendations"
import PDFReport from "@/components/PDFReport"
import SkincareRoutine from "@/components/SkincareRoutine"
import ProgressTracker from "@/components/ProgressTracker"
import SkinConditionInfo from "@/components/SkinConditionInfo"
import BeforeAfterComparison from "@/components/BeforeAfterComparison"

interface AnalysisResultsProps {
  analysisData: SkinAnalysisData
  imageUrl: string
  userName: string
  previousAnalyses?: SkinAnalysisData[]
  previousImages?: string[]
  onReset: () => void
}

export default function AnalysisResults({
  analysisData,
  imageUrl,
  userName,
  previousAnalyses = [],
  previousImages = [],
  onReset,
}: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "conditions" | "recommendations" | "routine" | "progress">(
    "overview",
  )
  const heatmapRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-semibold text-primary-800">Your Skin Analysis Results</h3>

        <div className="flex space-x-2">
          <button onClick={onReset} className="btn btn-outline text-sm py-1">
            New Analysis
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2" id="heatmap-container" ref={heatmapRef}>
          <FacialHeatmap imageUrl={imageUrl} analysisData={analysisData} />

          <div className="mt-6">
            <PDFReport analysisData={analysisData} imageUrl={imageUrl} userName={userName} />
          </div>

          {previousImages.length > 0 && previousAnalyses.length > 0 && (
            <div className="mt-6">
              <BeforeAfterComparison
                beforeImage={previousImages[previousImages.length - 1]}
                afterImage={imageUrl}
                beforeDate="Previous Analysis"
                afterDate="Current Analysis"
              />
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="flex flex-wrap border-b">
              <button
                className={`py-3 px-4 text-center font-medium ${
                  activeTab === "overview"
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-secondary-500 hover:text-primary-500"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`py-3 px-4 text-center font-medium ${
                  activeTab === "conditions"
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-secondary-500 hover:text-primary-500"
                }`}
                onClick={() => setActiveTab("conditions")}
              >
                Conditions
              </button>
              <button
                className={`py-3 px-4 text-center font-medium ${
                  activeTab === "recommendations"
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-secondary-500 hover:text-primary-500"
                }`}
                onClick={() => setActiveTab("recommendations")}
              >
                Products
              </button>
              <button
                className={`py-3 px-4 text-center font-medium ${
                  activeTab === "routine"
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-secondary-500 hover:text-primary-500"
                }`}
                onClick={() => setActiveTab("routine")}
              >
                Routine
              </button>
              <button
                className={`py-3 px-4 text-center font-medium ${
                  activeTab === "progress"
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-secondary-500 hover:text-primary-500"
                }`}
                onClick={() => setActiveTab("progress")}
              >
                Progress
              </button>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-serif font-semibold text-primary-800">Overall Skin Health</h4>
                    <div className="text-3xl font-bold text-primary-600">{analysisData.overallScore}%</div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div
                      className="bg-primary-500 h-2.5 rounded-full"
                      style={{ width: `${analysisData.overallScore}%` }}
                    ></div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-serif font-semibold text-primary-800 mb-2">Your Skin Type</h4>
                    <div className="inline-block px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
                      {analysisData.skinType}
                    </div>
                    <p className="mt-2 text-sm text-secondary-600">{getSkinTypeDescription(analysisData.skinType)}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-serif font-semibold text-primary-800 mb-2">Top Concerns</h4>
                    <div className="space-y-3">
                      {analysisData.concerns.slice(0, 3).map((concern, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="font-medium">{concern.name}</span>
                            <SkinConditionInfo conditionName={concern.name} />
                          </div>
                          <span className="text-primary-600 font-semibold">{Math.round(concern.severity * 100)}%</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveTab("conditions")}
                      className="mt-4 text-sm text-primary-600 font-medium hover:underline"
                    >
                      View all conditions →
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "conditions" && <ConditionDetails concerns={analysisData.concerns} />}

              {activeTab === "recommendations" && (
                <Recommendations recommendations={analysisData.recommendations} skinType={analysisData.skinType} />
              )}

              {activeTab === "routine" && <SkincareRoutine analysisData={analysisData} />}

              {activeTab === "progress" && (
                <ProgressTracker currentAnalysis={analysisData} previousAnalyses={previousAnalyses} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getSkinTypeDescription(skinType: string): string {
  switch (skinType) {
    case "Dry":
      return "Your skin produces less sebum than normal skin, leading to a lack of moisture and natural oils. This can make your skin feel tight and appear flaky."
    case "Oily":
      return "Your skin produces excess sebum, giving it a shiny appearance. This skin type is prone to enlarged pores and acne breakouts."
    case "Combination":
      return "Your skin has characteristics of both dry and oily skin. Typically, the T-zone (forehead, nose, and chin) is oily, while the cheeks are dry."
    case "Normal":
      return "Your skin is well-balanced, neither too oily nor too dry. It has good circulation, a smooth texture, and small pores."
    case "Sensitive":
      return "Your skin reacts easily to products and environmental factors, often resulting in redness, itching, or burning sensations."
    default:
      return "Your skin type has unique characteristics that require personalized care."
  }
}

