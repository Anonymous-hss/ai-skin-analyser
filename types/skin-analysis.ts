export interface SkinRegion {
  x: number
  y: number
  width: number
  height: number
  condition: string
  severity: number
}

export interface SkinConcern {
  name: string
  severity: number
  description: string
}

export interface SkinRecommendation {
  type: string
  product: string
  reason: string
}

export interface SkinAnalysisData {
  overallScore: number
  skinType: string
  concerns: SkinConcern[]
  recommendations: SkinRecommendation[]
  regions: SkinRegion[]
}

