"use client"

import { useState } from "react"
import type { SkinAnalysisData } from "@/types/skin-analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface ProgressTrackerProps {
  currentAnalysis: SkinAnalysisData
  previousAnalyses?: SkinAnalysisData[]
}

export default function ProgressTracker({ currentAnalysis, previousAnalyses = [] }: ProgressTrackerProps) {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null)

  // Combine current and previous analyses
  const allAnalyses = [...previousAnalyses, currentAnalysis]

  // Generate dates for the chart (assuming analyses are in chronological order)
  const dates = allAnalyses.map((_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (allAnalyses.length - 1 - index) * 30) // Assuming monthly analyses
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  })

  // Get all unique conditions across all analyses
  const allConditions = Array.from(
    new Set(allAnalyses.flatMap((analysis) => analysis.concerns.map((concern) => concern.name))),
  )

  // Prepare chart data for overall score
  const overallScoreData: ChartData<"line"> = {
    labels: dates,
    datasets: [
      {
        label: "Overall Skin Health",
        data: allAnalyses.map((analysis) => analysis.overallScore),
        borderColor: "#D99A41",
        backgroundColor: "rgba(217, 154, 65, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  // Prepare chart data for selected condition or all conditions
  const conditionsData: ChartData<"line"> = {
    labels: dates,
    datasets: selectedCondition
      ? [
          {
            label: selectedCondition,
            data: allAnalyses.map((analysis) => {
              const concern = analysis.concerns.find((c) => c.name === selectedCondition)
              return concern ? Math.round(concern.severity * 100) : 0
            }),
            borderColor: getConditionColor(selectedCondition),
            backgroundColor: `${getConditionColor(selectedCondition)}33`,
            tension: 0.3,
            fill: true,
          },
        ]
      : allConditions.slice(0, 3).map((condition) => ({
          label: condition,
          data: allAnalyses.map((analysis) => {
            const concern = analysis.concerns.find((c) => c.name === condition)
            return concern ? Math.round(concern.severity * 100) : 0
          }),
          borderColor: getConditionColor(condition),
          backgroundColor: "transparent",
          tension: 0.3,
        })),
  }

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Severity (%)",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-primary-800">Skin Progress Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="overall">Overall Health</TabsTrigger>
            <TabsTrigger value="conditions">Skin Conditions</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4">
            <div className="h-64">
              <Line data={overallScoreData} options={chartOptions} />
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-primary-700 mb-2">Progress Insights</h4>
              <p className="text-sm text-secondary-600">{getProgressInsight(allAnalyses)}</p>
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-1">Select Condition to Track</label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedCondition === null
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-secondary-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedCondition(null)}
                >
                  Top Conditions
                </button>

                {allConditions.map((condition, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedCondition === condition
                        ? "bg-primary-500 text-white"
                        : "bg-gray-200 text-secondary-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedCondition(condition)}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64">
              <Line data={conditionsData} options={chartOptions} />
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-primary-700 mb-2">Condition Insights</h4>
              <p className="text-sm text-secondary-600">{getConditionInsight(selectedCondition, allAnalyses)}</p>
            </div>
          </TabsContent>
        </Tabs>

        {previousAnalyses.length === 0 && (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
            <p className="text-sm text-secondary-600">
              <strong>Note:</strong> This is your first skin analysis. Complete regular analyses to track your skin's
              progress over time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getConditionColor(condition: string): string {
  const colors: Record<string, string> = {
    Acne: "#EF4444", // Red
    Dryness: "#F59E0B", // Amber
    Oiliness: "#10B981", // Emerald
    Wrinkles: "#3B82F6", // Blue
    Pigmentation: "#8B5CF6", // Violet
    Rosacea: "#EC4899", // Pink
    Eczema: "#F97316", // Orange
    Psoriasis: "#7C3AED", // Purple
    Melasma: "#78350F", // Brown
    Sensitivity: "#06B6D4", // Cyan
  }

  return colors[condition] || "#6B7280" // Gray default
}

function getProgressInsight(analyses: SkinAnalysisData[]): string {
  if (analyses.length <= 1) {
    return "Complete regular skin analyses to track your progress over time. We recommend monthly analyses for the best results."
  }

  const firstScore = analyses[0].overallScore
  const currentScore = analyses[analyses.length - 1].overallScore
  const difference = currentScore - firstScore

  if (difference > 10) {
    return "Your skin health has significantly improved! Your skincare routine is working well. Keep up the good work!"
  } else if (difference > 5) {
    return "Your skin health is showing positive improvement. Continue with your current skincare routine and consider adding targeted treatments for specific concerns."
  } else if (difference > 0) {
    return "Your skin health is gradually improving. Consistency is key - continue with your skincare routine and make sure you're protecting your skin from environmental damage."
  } else if (difference === 0) {
    return "Your skin health has remained stable. Consider adjusting your skincare routine to address specific concerns and improve overall skin health."
  } else if (difference > -5) {
    return "Your skin health has slightly decreased. This could be due to seasonal changes, stress, or other factors. Review your skincare routine and lifestyle factors."
  } else {
    return "Your skin health has declined. We recommend consulting with a dermatologist to identify potential causes and adjust your skincare routine accordingly."
  }
}

function getConditionInsight(condition: string | null, analyses: SkinAnalysisData[]): string {
  if (analyses.length <= 1) {
    return "Complete regular skin analyses to track changes in your skin conditions over time."
  }

  if (condition === null) {
    return "Select a specific condition to see detailed insights about your progress, or view the chart to compare your top skin concerns."
  }

  const firstAnalysis = analyses[0].concerns.find((c) => c.name === condition)
  const currentAnalysis = analyses[analyses.length - 1].concerns.find((c) => c.name === condition)

  if (!firstAnalysis || !currentAnalysis) {
    return `We don't have enough data to track your ${condition.toLowerCase()} over time. Continue with regular analyses to build your skin history.`
  }

  const firstSeverity = Math.round(firstAnalysis.severity * 100)
  const currentSeverity = Math.round(currentAnalysis.severity * 100)
  const difference = currentSeverity - firstSeverity

  if (difference < -20) {
    return `Your ${condition.toLowerCase()} has significantly improved! The treatments and products you're using are working effectively.`
  } else if (difference < -10) {
    return `Your ${condition.toLowerCase()} is showing good improvement. Continue with your current approach and consider adding targeted treatments for faster results.`
  } else if (difference < 0) {
    return `Your ${condition.toLowerCase()} is gradually improving. Consistency is key - stick with your routine and be patient as your skin continues to heal.`
  } else if (difference === 0) {
    return `Your ${condition.toLowerCase()} has remained stable. Consider adjusting your skincare routine with more targeted treatments for this specific concern.`
  } else if (difference < 10) {
    return `Your ${condition.toLowerCase()} has slightly worsened. This could be due to seasonal changes, stress, or other factors. Review your skincare routine and lifestyle factors.`
  } else {
    return `Your ${condition.toLowerCase()} has worsened. We recommend consulting with a dermatologist to identify potential causes and adjust your treatment approach.`
  }
}

