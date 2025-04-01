import axios from "axios";
import type { SkinAnalysisData } from "@/types/skin-analysis";

/**
 * Processes an image and returns detailed skin analysis
 * @param {string} imageDataUrl - The image data URL
 * @returns {Promise<SkinAnalysisData>} - The analysis results
 */
export async function analyzeSkin(
  imageDataUrl: string
): Promise<SkinAnalysisData> {
  try {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    // Create form data
    const formData = new FormData();
    formData.append("image", blob, "image.jpg");

    // Send to API route
    const result = await axios.post("/api/analyze-skin", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return result.data;
  } catch (error) {
    console.error("Error analyzing skin:", error);
    throw new Error("Failed to analyze skin image");
  }
}
