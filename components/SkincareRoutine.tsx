"use client"

import type { SkinAnalysisData } from "@/types/skin-analysis"

interface SkincareRoutineProps {
  analysisData: SkinAnalysisData
}

export default function SkincareRoutine({ analysisData }: SkincareRoutineProps) {
  const { skinType, concerns, recommendations } = analysisData

  // Get top concerns
  const topConcerns = [...concerns].sort((a, b) => b.severity - a.severity).slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-semibold text-primary-800 mb-2">Your Personalized Skincare Routine</h3>
        <p className="text-sm text-secondary-600">
          Based on your {skinType.toLowerCase()} skin type and specific concerns, we've created a customized skincare
          routine to help improve your skin health.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-serif font-semibold text-primary-700 mb-3">Morning Routine</h4>
          <div className="space-y-4">
            <RoutineStep
              number={1}
              title="Cleanse"
              product={getCleanserRecommendation(recommendations, "morning")}
              description="Start with a gentle cleanser to remove impurities that accumulated overnight without stripping your skin."
            />

            <RoutineStep
              number={2}
              title="Tone (Optional)"
              product={getToneRecommendation(skinType)}
              description="Balance your skin's pH and prepare it for the next steps in your routine."
            />

            <RoutineStep
              number={3}
              title="Treatment"
              product={getTreatmentRecommendation(recommendations, topConcerns, "morning")}
              description="Address your specific skin concerns with targeted treatments."
            />

            <RoutineStep
              number={4}
              title="Moisturize"
              product={getMoisturizerRecommendation(recommendations, "morning")}
              description="Hydrate and protect your skin barrier with a moisturizer suited for your skin type."
            />

            <RoutineStep
              number={5}
              title="Sunscreen"
              product={getSunscreenRecommendation(recommendations, skinType)}
              description="Protect your skin from UV damage with a broad-spectrum sunscreen. This is the most important step for preventing premature aging and hyperpigmentation."
            />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-serif font-semibold text-primary-700 mb-3">Evening Routine</h4>
          <div className="space-y-4">
            <RoutineStep
              number={1}
              title="Double Cleanse"
              product={getCleanserRecommendation(recommendations, "evening")}
              description="First remove makeup and sunscreen with an oil-based cleanser, then follow with your regular cleanser to thoroughly clean your skin."
            />

            <RoutineStep
              number={2}
              title="Exfoliate (2-3 times per week)"
              product={getExfoliatorRecommendation(skinType, topConcerns)}
              description="Remove dead skin cells to improve texture and allow better penetration of other products."
            />

            <RoutineStep
              number={3}
              title="Tone (Optional)"
              product={getToneRecommendation(skinType)}
              description="Balance your skin's pH and prepare it for the next steps in your routine."
            />

            <RoutineStep
              number={4}
              title="Treatment"
              product={getTreatmentRecommendation(recommendations, topConcerns, "evening")}
              description="Use more intensive treatments in the evening when your skin is in repair mode."
            />

            <RoutineStep
              number={5}
              title="Moisturize"
              product={getMoisturizerRecommendation(recommendations, "evening")}
              description="Lock in moisture and support your skin's overnight repair process with a nourishing moisturizer."
            />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-serif font-semibold text-primary-700 mb-3">Weekly Treatments</h4>
          <div className="space-y-4">
            <RoutineStep
              number={1}
              title="Face Mask"
              product={getMaskRecommendation(skinType, topConcerns)}
              description="Use a targeted face mask 1-2 times per week to address specific concerns and give your skin an extra boost."
            />

            <RoutineStep
              number={2}
              title="Intensive Treatment"
              product={getIntensiveTreatmentRecommendation(topConcerns)}
              description="Apply a more intensive treatment once a week to target your most pressing skin concerns."
            />
          </div>
        </div>
      </div>

      <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
        <h4 className="font-medium text-primary-700 mb-2">Additional Tips</h4>
        <ul className="text-sm text-secondary-600 space-y-2">
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Introduce new products one at a time to identify any potential reactions.</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Always patch test new products, especially if you have sensitive skin.</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Consistency is key - stick with your routine for at least 4-6 weeks to see results.</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Don't forget lifestyle factors: stay hydrated, eat a balanced diet, and get enough sleep.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

interface RoutineStepProps {
  number: number
  title: string
  product: string
  description: string
}

function RoutineStep({ number, title, product, description }: RoutineStepProps) {
  return (
    <div className="flex items-start">
      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">
        <span className="font-medium">{number}</span>
      </div>
      <div>
        <h5 className="font-medium text-primary-800">{title}</h5>
        <p className="text-primary-600 font-medium text-sm">{product}</p>
        <p className="text-sm text-secondary-600 mt-1">{description}</p>
      </div>
    </div>
  )
}

// Helper functions to generate routine recommendations

function getCleanserRecommendation(recommendations: any[], time: "morning" | "evening"): string {
  const cleanser = recommendations.find((rec) => rec.type === "Cleanser")?.product || "Gentle pH-Balanced Cleanser"

  if (time === "evening") {
    return `First cleanse: Micellar Water or Cleansing Oil\nSecond cleanse: ${cleanser}`
  }

  return cleanser
}

function getToneRecommendation(skinType: string): string {
  switch (skinType) {
    case "Dry":
      return "Hydrating Toner with Hyaluronic Acid"
    case "Oily":
      return "Balancing Toner with Witch Hazel"
    case "Combination":
      return "Balancing Toner with Niacinamide"
    case "Sensitive":
      return "Alcohol-Free Calming Toner"
    default:
      return "Hydrating Alcohol-Free Toner"
  }
}

function getTreatmentRecommendation(recommendations: any[], topConcerns: any[], time: "morning" | "evening"): string {
  const treatment = recommendations.find((rec) => rec.type === "Treatment")?.product || "Antioxidant Serum"

  if (time === "morning") {
    // For morning, focus on protection
    if (topConcerns.some((c) => c.name === "Pigmentation" || c.name === "Melasma")) {
      return "Vitamin C Serum"
    }
    return "Antioxidant Serum with Niacinamide"
  } else {
    // For evening, focus on repair
    if (topConcerns.some((c) => c.name === "Wrinkles")) {
      return "Retinol Serum (Start with low concentration)"
    }
    return treatment
  }
}

function getMoisturizerRecommendation(recommendations: any[], time: "morning" | "evening"): string {
  const moisturizer =
    recommendations.find((rec) => rec.type === "Moisturizer")?.product || "Balanced Hydration Moisturizer"

  if (time === "evening") {
    // Evening moisturizers are typically richer
    if (moisturizer.includes("Gel") || moisturizer.includes("Lightweight")) {
      return moisturizer.replace("Gel", "Cream").replace("Lightweight", "Nourishing")
    }
    return `Rich ${moisturizer}`
  }

  return moisturizer
}

function getSunscreenRecommendation(recommendations: any[], skinType: string): string {
  const sunscreen = recommendations.find((rec) => rec.type === "Sunscreen")?.product || "Broad Spectrum SPF 50"

  if (skinType === "Oily") {
    return "Oil-Free Matte Broad Spectrum SPF 50"
  } else if (skinType === "Sensitive") {
    return "Mineral Broad Spectrum SPF 30-50"
  }

  return sunscreen
}

function getExfoliatorRecommendation(skinType: string, topConcerns: any[]): string {
  if (skinType === "Sensitive") {
    return "Gentle Enzyme Exfoliator"
  }

  if (topConcerns.some((c) => c.name === "Acne" || c.name === "Oiliness")) {
    return "BHA (Salicylic Acid) Exfoliant"
  }

  if (topConcerns.some((c) => c.name === "Pigmentation" || c.name === "Melasma" || c.name === "Wrinkles")) {
    return "AHA (Glycolic or Lactic Acid) Exfoliant"
  }

  return "Gentle Chemical Exfoliant (AHA/BHA Blend)"
}

function getMaskRecommendation(skinType: string, topConcerns: any[]): string {
  if (topConcerns.some((c) => c.name === "Acne" || c.name === "Oiliness")) {
    return "Clay or Charcoal Mask"
  }

  if (topConcerns.some((c) => c.name === "Dryness")) {
    return "Hydrating Sheet Mask or Overnight Mask"
  }

  if (topConcerns.some((c) => c.name === "Pigmentation" || c.name === "Melasma")) {
    return "Brightening Mask with Vitamin C or Niacinamide"
  }

  if (skinType === "Sensitive" || topConcerns.some((c) => c.name === "Rosacea" || c.name === "Sensitivity")) {
    return "Calming Mask with Centella Asiatica or Oat Extract"
  }

  return "Hydrating and Brightening Mask"
}

function getIntensiveTreatmentRecommendation(topConcerns: any[]): string {
  const topConcern = topConcerns[0]?.name.toLowerCase() || ""

  switch (topConcern) {
    case "acne":
      return "Sulfur or Benzoyl Peroxide Spot Treatment"
    case "dryness":
      return "Intensive Hydrating Mask or Facial Oil"
    case "oiliness":
      return "Clarifying Treatment with Niacinamide"
    case "wrinkles":
      return "Anti-Aging Treatment with Peptides"
    case "pigmentation":
      return "Brightening Treatment with Alpha Arbutin"
    case "rosacea":
      return "Azelaic Acid Treatment"
    case "eczema":
      return "Barrier Repair Treatment with Ceramides"
    case "psoriasis":
      return "Medicated Treatment (Consult Dermatologist)"
    case "melasma":
      return "Tranexamic Acid Treatment"
    case "sensitivity":
      return "Barrier Strengthening Treatment"
    default:
      return "Multi-Benefit Treatment Mask"
  }
}

