"use client"

import { useState } from "react"
import type { SkinConcern } from "@/types/skin-analysis"

interface ConditionDetailsProps {
  concerns: SkinConcern[]
}

export default function ConditionDetails({ concerns }: ConditionDetailsProps) {
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null)

  const toggleCondition = (name: string) => {
    if (expandedCondition === name) {
      setExpandedCondition(null)
    } else {
      setExpandedCondition(name)
    }
  }

  // Sort concerns by severity (highest first)
  const sortedConcerns = [...concerns].sort((a, b) => b.severity - a.severity)

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-serif font-semibold text-primary-800 mb-2">Detected Skin Conditions</h4>

      <div className="space-y-4">
        {sortedConcerns.map((concern, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleCondition(concern.name)}
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{
                    backgroundColor: getSeverityColor(concern.severity),
                  }}
                ></div>
                <span className="font-medium">{concern.name}</span>
              </div>

              <div className="flex items-center">
                <span className="text-primary-600 font-semibold mr-3">{Math.round(concern.severity * 100)}%</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    expandedCondition === concern.name ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {expandedCondition === concern.name && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-secondary-700 mb-3">{concern.description}</p>

                <div className="mb-3">
                  <div className="text-sm font-medium text-secondary-600 mb-1">Severity Level</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.round(concern.severity * 100)}%`,
                        backgroundColor: getSeverityColor(concern.severity),
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-secondary-600 mb-1">What This Means</div>
                  <p className="text-sm text-secondary-700">{getConditionExplanation(concern.name)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function getSeverityColor(severity: number): string {
  if (severity < 0.3) return "#4ade80" // Green for low severity
  if (severity < 0.7) return "#facc15" // Yellow for medium severity
  return "#ef4444" // Red for high severity
}

function getConditionExplanation(condition: string): string {
  const explanations: Record<string, string> = {
    Acne: "Acne occurs when hair follicles become clogged with oil and dead skin cells. It can cause whiteheads, blackheads, or pimples. Factors like hormones, diet, and stress can contribute to acne development.",
    Dryness:
      "Dry skin lacks moisture and natural oils, making it feel tight and appear flaky. It can be caused by weather conditions, hot water, harsh soaps, or underlying medical conditions.",
    Oiliness:
      "Oily skin is characterized by excess sebum production, giving it a shiny appearance. It can lead to enlarged pores and acne breakouts. Hormones, genetics, and climate can influence skin oiliness.",
    Wrinkles:
      "Wrinkles are lines and creases in the skin that develop naturally with age as skin becomes thinner, drier, and less elastic. Sun exposure, smoking, and facial expressions can accelerate wrinkle formation.",
    Pigmentation:
      "Pigmentation refers to uneven skin tone or dark spots caused by excess melanin production. It can result from sun exposure, hormonal changes, inflammation, or aging.",
    Rosacea:
      "Rosacea is a chronic skin condition characterized by redness, visible blood vessels, and sometimes small, red bumps. It typically affects the face and can be triggered by various factors.",
    Eczema:
      "Eczema is a condition that makes your skin red, itchy, and inflamed. It's common in children but can occur at any age. It's often related to allergies and asthma.",
    Psoriasis:
      "Psoriasis is an autoimmune condition that causes rapid skin cell growth, resulting in thick, scaly patches. It's a chronic condition with periods of flare-ups and remission.",
    Melasma:
      "Melasma appears as brown or gray-brown patches, typically on the face. It's often triggered by hormonal changes and sun exposure, and is more common in women.",
    Sensitivity:
      "Sensitive skin reacts easily to products and environmental factors, often resulting in redness, itching, or burning sensations. It may be caused by genetic factors or skin conditions.",
  }

  return (
    explanations[condition] ||
    "This skin condition affects your skin's appearance and health. Proper skincare and treatment can help manage it effectively."
  )
}

