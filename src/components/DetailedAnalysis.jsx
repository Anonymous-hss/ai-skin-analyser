"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DetailedAnalysis({ analysisData, onDownloadReport }) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!analysisData) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6 text-center">
          <p>No analysis data available</p>
        </CardContent>
      </Card>
    )
  }

  const {
    overallScore = 75,
    skinType = "Combination",
    concerns = [
      { name: "Acne", severity: 0.3, description: "Mild acne present in T-zone" },
      { name: "Dryness", severity: 0.5, description: "Moderate dryness on cheeks" },
      { name: "Wrinkles", severity: 0.2, description: "Fine lines around eyes" },
      { name: "Pigmentation", severity: 0.4, description: "Some dark spots on forehead" },
    ],
    recommendations = [
      { type: "Cleanser", product: "Gentle Foaming Cleanser", reason: "For combination skin" },
      { type: "Moisturizer", product: "Hydrating Gel Cream", reason: "To balance oil and hydration" },
      { type: "Treatment", product: "Salicylic Acid Serum", reason: "For acne prevention" },
      { type: "Sunscreen", product: "SPF 50 Lightweight Sunscreen", reason: "To prevent further pigmentation" },
    ],
  } = analysisData

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Detailed Skin Analysis</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center" onClick={onDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="concerns">Concerns</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Overall Skin Health</h3>
                <p className="text-sm text-gray-500">Based on multiple factors</p>
              </div>
              <div className="text-3xl font-bold">{overallScore}%</div>
            </div>

            <Progress value={overallScore} className="h-3" />

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Skin Type</h3>
                <span className="text-lg font-semibold">{skinType}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                <div
                  className={`text-center p-2 rounded-md ${skinType === "Dry" ? "bg-primary text-primary-foreground" : "bg-gray-100"}`}
                >
                  Dry
                </div>
                <div
                  className={`text-center p-2 rounded-md ${skinType === "Oily" ? "bg-primary text-primary-foreground" : "bg-gray-100"}`}
                >
                  Oily
                </div>
                <div
                  className={`text-center p-2 rounded-md ${skinType === "Combination" ? "bg-primary text-primary-foreground" : "bg-gray-100"}`}
                >
                  Combination
                </div>
                <div
                  className={`text-center p-2 rounded-md ${skinType === "Normal" ? "bg-primary text-primary-foreground" : "bg-gray-100"}`}
                >
                  Normal
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="concerns" className="space-y-6">
            {concerns.map((concern, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">{concern.name}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{concern.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-lg font-semibold">{Math.round(concern.severity * 100)}%</div>
                </div>
                <Progress value={concern.severity * 100} className="h-2" />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{rec.type}</h3>
                    <p className="text-primary font-semibold">{rec.product}</p>
                    <p className="text-sm text-gray-500 mt-1">{rec.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

