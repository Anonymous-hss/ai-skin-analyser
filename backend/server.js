import express from "express"
import multer from "multer"
import cors from "cors"
import dotenv from "dotenv"
import { HfInference } from "@huggingface/inference"
import sharp from "sharp"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const port = process.env.PORT || 5000

// Set up multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Enable CORS
app.use(cors())
app.use(express.json())

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY)

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Analyze skin image
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" })
    }

    // Process image with sharp
    const processedImageBuffer = await sharp(req.file.buffer).resize(512, 512, { fit: "contain" }).toBuffer()

    // Save processed image temporarily
    const imagePath = path.join(uploadsDir, `${Date.now()}.jpg`)
    fs.writeFileSync(imagePath, processedImageBuffer)

    // Use Hugging Face for face detection
    const faceDetectionResult = await detectFace(imagePath)

    // Use Hugging Face for skin analysis
    const skinAnalysisResult = await analyzeSkinWithHuggingFace(imagePath)

    // Clean up temporary file
    fs.unlinkSync(imagePath)

    // Process and combine results
    const analysisResults = processResults(faceDetectionResult, skinAnalysisResult)

    res.json(analysisResults)
  } catch (error) {
    console.error("Error processing image:", error)
    res.status(500).json({ error: "Failed to process image", details: error.message })
  }
})

/**
 * Detect faces in the image using Hugging Face
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Object>} - Face detection results
 */
async function detectFace(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath)

    // Use Hugging Face's face detection model
    const result = await hf.objectDetection({
      model: "facebook/detr-resnet-50",
      data: imageBuffer,
    })

    return result
  } catch (error) {
    console.error("Face detection error:", error)
    return { error: error.message }
  }
}

/**
 * Analyze skin using Hugging Face models
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Object>} - Skin analysis results
 */
async function analyzeSkinWithHuggingFace(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath)

    // Use Hugging Face's image classification model
    // You can replace this with a more specific skin analysis model if available
    const result = await hf.imageClassification({
      model: "microsoft/resnet-50",
      data: imageBuffer,
    })

    return result
  } catch (error) {
    console.error("Skin analysis error:", error)
    return { error: error.message }
  }
}

/**
 * Process and combine results from different models
 * @param {Object} faceDetection - Face detection results
 * @param {Object} skinAnalysis - Skin analysis results
 * @returns {Object} - Combined analysis results
 */
function processResults(faceDetection, skinAnalysis) {
  // In a real application, you would process the results from the models
  // to extract meaningful skin analysis data

  // For this example, we'll generate mock data based on the model outputs
  const skinConditions = ["acne", "dryness", "oiliness", "wrinkles", "pigmentation"]
  const skinTypes = ["Dry", "Oily", "Combination", "Normal"]

  // Generate a score based on classification confidence
  let overallScore = 75
  if (skinAnalysis && !skinAnalysis.error && skinAnalysis.length > 0) {
    // Use the confidence of the top classification as a factor
    const topConfidence = skinAnalysis[0].score || 0.5
    overallScore = Math.round(70 + topConfidence * 30)
  }

  // Determine regions based on face detection
  const regions = []
  if (faceDetection && !faceDetection.error && faceDetection.length > 0) {
    // Use detected objects to create regions
    faceDetection.forEach((detection, index) => {
      if (detection.score > 0.5) {
        // Only use confident detections
        const { box } = detection

        // Create a region based on the detection
        regions.push({
          x: box.xmin,
          y: box.ymin,
          width: box.xmax - box.xmin,
          height: box.ymax - box.ymin,
          condition: skinConditions[index % skinConditions.length],
          severity: detection.score,
        })
      }
    })
  }

  // If no regions were detected, create mock regions
  if (regions.length === 0) {
    // Create forehead region
    regions.push({
      x: 150,
      y: 50,
      width: 200,
      height: 100,
      condition: skinConditions[Math.floor(Math.random() * skinConditions.length)],
      severity: Math.random() * 0.7 + 0.3,
    })

    // Create cheeks regions
    regions.push({
      x: 100,
      y: 150,
      width: 100,
      height: 100,
      condition: skinConditions[Math.floor(Math.random() * skinConditions.length)],
      severity: Math.random() * 0.7 + 0.3,
    })

    regions.push({
      x: 300,
      y: 150,
      width: 100,
      height: 100,
      condition: skinConditions[Math.floor(Math.random() * skinConditions.length)],
      severity: Math.random() * 0.7 + 0.3,
    })

    // Create nose and T-zone
    regions.push({
      x: 200,
      y: 150,
      width: 100,
      height: 150,
      condition: skinConditions[Math.floor(Math.random() * skinConditions.length)],
      severity: Math.random() * 0.7 + 0.3,
    })

    // Create chin region
    regions.push({
      x: 200,
      y: 300,
      width: 100,
      height: 80,
      condition: skinConditions[Math.floor(Math.random() * skinConditions.length)],
      severity: Math.random() * 0.7 + 0.3,
    })
  }

  // Generate concerns based on regions
  const concerns = []
  const conditionCounts = {}

  regions.forEach((region) => {
    if (!conditionCounts[region.condition]) {
      conditionCounts[region.condition] = {
        count: 0,
        totalSeverity: 0,
      }
    }

    conditionCounts[region.condition].count++
    conditionCounts[region.condition].totalSeverity += region.severity
  })

  // Create concerns from condition counts
  Object.entries(conditionCounts).forEach(([condition, data]) => {
    const avgSeverity = data.totalSeverity / data.count

    concerns.push({
      name: condition.charAt(0).toUpperCase() + condition.slice(1),
      severity: avgSeverity,
      description: getDescriptionForCondition(condition, avgSeverity),
    })
  })

  // Add any missing concerns to ensure we have a complete analysis
  skinConditions.forEach((condition) => {
    if (!conditionCounts[condition]) {
      concerns.push({
        name: condition.charAt(0).toUpperCase() + condition.slice(1),
        severity: Math.random() * 0.3, // Low severity for conditions not detected
        description: getDescriptionForCondition(condition, 0.2),
      })
    }
  })

  // Generate recommendations based on concerns
  const recommendations = generateRecommendations(concerns)

  // Determine skin type (in a real app, this would be based on analysis)
  const skinType = skinTypes[Math.floor(Math.random() * skinTypes.length)]

  return {
    overallScore,
    skinType,
    concerns,
    recommendations,
    regions,
  }
}

/**
 * Get description for a skin condition based on severity
 * @param {string} condition - The skin condition
 * @param {number} severity - The severity level (0-1)
 * @returns {string} - Description of the condition
 */
function getDescriptionForCondition(condition, severity) {
  const severityLevel = severity < 0.3 ? "Mild" : severity < 0.7 ? "Moderate" : "Severe"

  const descriptions = {
    acne: {
      Mild: "Mild acne with few visible blemishes",
      Moderate: "Moderate acne present, particularly in the T-zone",
      Severe: "Significant acne with multiple inflamed blemishes",
    },
    dryness: {
      Mild: "Slight dryness in some areas",
      Moderate: "Moderate dryness, particularly on cheeks and around mouth",
      Severe: "Significant dryness with potential flaking and tightness",
    },
    oiliness: {
      Mild: "Slight oiliness in the T-zone",
      Moderate: "Moderate oil production across T-zone and cheeks",
      Severe: "Excessive oiliness throughout face",
    },
    wrinkles: {
      Mild: "Fine lines beginning to appear around eyes",
      Moderate: "Visible lines around eyes and forehead",
      Severe: "Deep wrinkles and expression lines",
    },
    pigmentation: {
      Mild: "Slight uneven skin tone",
      Moderate: "Noticeable dark spots and uneven pigmentation",
      Severe: "Significant hyperpigmentation and dark patches",
    },
  }

  return descriptions[condition][severityLevel] || `${severityLevel} ${condition} detected`
}

/**
 * Generate product recommendations based on skin concerns
 * @param {Array} concerns - Array of skin concerns
 * @returns {Array} - Product recommendations
 */
function generateRecommendations(concerns) {
  // Sort concerns by severity
  const sortedConcerns = [...concerns].sort((a, b) => b.severity - a.severity)

  const recommendations = [
    {
      type: "Cleanser",
      product: getCleanserRecommendation(sortedConcerns),
      reason: "To cleanse your skin without disrupting its natural balance",
    },
    {
      type: "Moisturizer",
      product: getMoisturizerRecommendation(sortedConcerns),
      reason: "To provide hydration and strengthen skin barrier",
    },
    {
      type: "Treatment",
      product: getTreatmentRecommendation(sortedConcerns[0]),
      reason: `To specifically address your ${sortedConcerns[0].name.toLowerCase()} concerns`,
    },
    {
      type: "Sunscreen",
      product: "Broad Spectrum SPF 50",
      reason: "To protect against UV damage and prevent further skin issues",
    },
  ]

  return recommendations
}

/**
 * Get cleanser recommendation based on concerns
 * @param {Array} concerns - Sorted array of skin concerns
 * @returns {string} - Cleanser recommendation
 */
function getCleanserRecommendation(concerns) {
  const topConcern = concerns[0].name.toLowerCase()

  switch (topConcern) {
    case "acne":
      return "Salicylic Acid Gentle Cleanser"
    case "dryness":
      return "Hydrating Cream Cleanser"
    case "oiliness":
      return "Foaming Gel Cleanser"
    case "wrinkles":
      return "Anti-Aging Cream Cleanser"
    case "pigmentation":
      return "Brightening Gentle Cleanser"
    default:
      return "Gentle pH-Balanced Cleanser"
  }
}

/**
 * Get moisturizer recommendation based on concerns
 * @param {Array} concerns - Sorted array of skin concerns
 * @returns {string} - Moisturizer recommendation
 */
function getMoisturizerRecommendation(concerns) {
  const topConcern = concerns[0].name.toLowerCase()

  switch (topConcern) {
    case "acne":
      return "Oil-Free Gel Moisturizer"
    case "dryness":
      return "Rich Hydrating Cream"
    case "oiliness":
      return "Lightweight Oil-Control Moisturizer"
    case "wrinkles":
      return "Anti-Aging Peptide Moisturizer"
    case "pigmentation":
      return "Even Tone Moisturizer with Niacinamide"
    default:
      return "Balanced Hydration Moisturizer"
  }
}

/**
 * Get treatment recommendation based on top concern
 * @param {Object} topConcern - The top skin concern
 * @returns {string} - Treatment recommendation
 */
function getTreatmentRecommendation(topConcern) {
  const concern = topConcern.name.toLowerCase()

  switch (concern) {
    case "acne":
      return "Benzoyl Peroxide Spot Treatment"
    case "dryness":
      return "Hyaluronic Acid Serum"
    case "oiliness":
      return "Niacinamide Serum"
    case "wrinkles":
      return "Retinol Night Serum"
    case "pigmentation":
      return "Vitamin C Brightening Serum"
    default:
      return "Antioxidant Serum"
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

