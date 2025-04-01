import axios from "axios"

// Backend API URL - change this to your actual backend URL
const API_URL = "http://localhost:5000/api"

/**
 * Processes an image and returns detailed skin analysis
 * @param {string} imageDataUrl - The image data URL
 * @returns {Promise<Object>} - The analysis results
 */
export async function analyzeSkin(imageDataUrl) {
  try {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl)
    const blob = await response.blob()

    // Create form data
    const formData = new FormData()
    formData.append("image", blob, "image.jpg")

    // Send to backend
    const result = await axios.post(`${API_URL}/analyze`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return result.data
  } catch (error) {
    console.error("Error analyzing skin:", error)

    // For testing without backend, return mock data
    if (!API_URL.startsWith("http://localhost")) {
      throw error
    }

    console.warn("Using mock data for testing")
    return getMockAnalysisData()
  }
}

/**
 * Generates mock analysis data for testing
 * @returns {Object} - Mock analysis data
 */
function getMockAnalysisData() {
  return {
    overallScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
    skinType: ["Dry", "Oily", "Combination", "Normal"][Math.floor(Math.random() * 4)],
    concerns: [
      {
        name: "Acne",
        severity: Math.random() * 0.5,
        description: "Mild to moderate acne present in T-zone",
      },
      {
        name: "Dryness",
        severity: Math.random() * 0.6,
        description: "Some dryness on cheeks and around mouth",
      },
      {
        name: "Wrinkles",
        severity: Math.random() * 0.4,
        description: "Fine lines around eyes and forehead",
      },
      {
        name: "Pigmentation",
        severity: Math.random() * 0.7,
        description: "Uneven skin tone and dark spots",
      },
      {
        name: "Oiliness",
        severity: Math.random() * 0.5,
        description: "Excess oil in T-zone area",
      },
    ],
    recommendations: [
      {
        type: "Cleanser",
        product: "Gentle Foaming Cleanser",
        reason: "For your skin type to remove impurities without stripping",
      },
      {
        type: "Moisturizer",
        product: "Hydrating Gel Cream",
        reason: "To balance oil and provide hydration",
      },
      {
        type: "Treatment",
        product: "Salicylic Acid Serum",
        reason: "To address acne concerns and prevent breakouts",
      },
      {
        type: "Sunscreen",
        product: "SPF 50 Lightweight Sunscreen",
        reason: "To protect against UV damage and prevent pigmentation",
      },
    ],
    regions: generateMockRegions(),
  }
}

/**
 * Generates mock regions for the heatmap
 * @returns {Array} - Array of region objects
 */
function generateMockRegions() {
  const regions = []
  const conditions = ["acne", "dryness", "oiliness", "wrinkles", "pigmentation"]

  // Forehead region
  regions.push({
    x: 150,
    y: 50,
    width: 200,
    height: 100,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    severity: Math.random() * 0.7 + 0.3,
  })

  // Cheeks regions
  regions.push({
    x: 100,
    y: 150,
    width: 100,
    height: 100,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    severity: Math.random() * 0.7 + 0.3,
  })

  regions.push({
    x: 300,
    y: 150,
    width: 100,
    height: 100,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    severity: Math.random() * 0.7 + 0.3,
  })

  // Nose and T-zone
  regions.push({
    x: 200,
    y: 150,
    width: 100,
    height: 150,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    severity: Math.random() * 0.7 + 0.3,
  })

  // Chin region
  regions.push({
    x: 200,
    y: 300,
    width: 100,
    height: 80,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    severity: Math.random() * 0.7 + 0.3,
  })

  return regions
}

