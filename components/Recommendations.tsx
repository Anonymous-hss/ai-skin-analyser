"use client"

import type { SkinRecommendation } from "@/types/skin-analysis"

interface RecommendationsProps {
  recommendations: SkinRecommendation[]
  skinType: string
}

export default function Recommendations({ recommendations, skinType }: RecommendationsProps) {
  return (
    <div>
      <h4 className="text-lg font-serif font-semibold text-primary-800 mb-4">Personalized Recommendations</h4>

      <div className="mb-6">
        <p className="text-secondary-700 mb-2">
          Based on your {skinType.toLowerCase()} skin type and the detected conditions, we recommend the following
          skincare routine:
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div className="flex-1">
                <h5 className="font-medium text-primary-800 mb-1">{rec.type}</h5>
                <p className="text-primary-600 font-semibold mb-1">{rec.product}</p>
                <p className="text-sm text-secondary-600">{rec.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
        <h5 className="font-medium text-primary-800 mb-2">General Advice</h5>
        <ul className="text-sm text-secondary-700 space-y-2">
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
            <span>Always wear sunscreen with at least SPF 30, even on cloudy days</span>
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
            <span>Stay hydrated by drinking at least 8 glasses of water daily</span>
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
            <span>Maintain a consistent skincare routine morning and night</span>
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
            <span>Avoid touching your face throughout the day</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

