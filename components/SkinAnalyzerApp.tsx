"use client";

import { useState, useEffect } from "react";
import ImageCapture from "@/components/ImageCapture";
import ScanningProcess from "@/components/ScanningProcess";
import AnalysisResults from "@/components/AnalysisResults";
import AuthForm from "@/components/AuthForm";
import type { SkinAnalysisData } from "@/types/skin-analysis";
import axios from "axios";

export default function SkinAnalyzerApp() {
  const [step, setStep] = useState<"auth" | "capture" | "scanning" | "results">(
    "auth"
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<SkinAnalysisData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // User history state
  const [previousAnalyses, setPreviousAnalyses] = useState<SkinAnalysisData[]>(
    []
  );
  const [previousImages, setPreviousImages] = useState<string[]>([]);

  // Check for existing session on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        setAuthToken(token);
        setUser(JSON.parse(userData));
        setUserName(JSON.parse(userData).name);
        setStep("capture");
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
  }, []);

  // Load previous analyses from localStorage on component mount
  useEffect(() => {
    if (user) {
      try {
        const savedAnalyses = localStorage.getItem(
          `skinAnalyses:${user.phoneNumber}`
        );
        const savedImages = localStorage.getItem(
          `skinImages:${user.phoneNumber}`
        );

        if (savedAnalyses) {
          setPreviousAnalyses(JSON.parse(savedAnalyses));
        }

        if (savedImages) {
          setPreviousImages(JSON.parse(savedImages));
        }
      } catch (error) {
        console.error("Error loading previous analyses:", error);
      }
    }
  }, [user]);

  const handleAuthenticated = (token: string, userData: any) => {
    setAuthToken(token);
    setUser(userData);
    setUserName(userData.name);

    // Save to localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));

    setStep("capture");
  };

  const handleCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setStep("scanning");
  };

  const handleAnalysisComplete = async (data: SkinAnalysisData) => {
    setAnalysisData(data);
    setStep("results");
    setIsLoading(false);

    // Mark user as having used the service
    if (authToken) {
      try {
        await axios.post(
          "/api/auth/mark-used",
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error marking user as used:", error);
      }
    }

    // Save current analysis and image to history
    if (user) {
      try {
        const updatedAnalyses = [...previousAnalyses, data];
        const updatedImages = [...previousImages, capturedImage!];

        // Limit history to last 5 analyses
        if (updatedAnalyses.length > 5) {
          updatedAnalyses.shift();
          updatedImages.shift();
        }

        setPreviousAnalyses(updatedAnalyses);
        setPreviousImages(updatedImages);

        localStorage.setItem(
          `skinAnalyses:${user.phoneNumber}`,
          JSON.stringify(updatedAnalyses)
        );
        localStorage.setItem(
          `skinImages:${user.phoneNumber}`,
          JSON.stringify(updatedImages)
        );
      } catch (error) {
        console.error("Error saving analysis history:", error);
      }
    }
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setStep("capture");
    setIsLoading(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisData(null);
    setError(null);
    setStep("capture");
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setUserName("");
    setStep("auth");

    // Clear from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-primary-800 mb-2">
          AI-Powered Skin Analysis
        </h2>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Get a detailed analysis of your skin conditions with our advanced AI
          technology. Identify up to 10 different skin conditions and receive
          personalized recommendations.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button
            className="text-red-700 font-semibold underline mt-1"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {step === "auth" ? (
        <AuthForm onAuthenticated={handleAuthenticated} />
      ) : (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-1/3 flex flex-col">
            <div className="card mb-4">
              <h3 className="text-xl font-serif font-semibold text-primary-800 mb-4">
                {step === "capture"
                  ? "Step 1: Capture Your Image"
                  : step === "scanning"
                  ? "Step 2: Analyzing Your Skin"
                  : "Step 3: Review Your Results"}
              </h3>

              <div className="space-y-4">
                <div
                  className={`flex items-center ${
                    step === "capture"
                      ? "text-primary-500"
                      : "text-secondary-400"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-current flex items-center justify-center mr-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span className={step === "capture" ? "font-medium" : ""}>
                    Capture a clear photo of your face
                  </span>
                </div>

                <div
                  className={`flex items-center ${
                    step === "scanning"
                      ? "text-primary-500"
                      : "text-secondary-400"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-current flex items-center justify-center mr-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span className={step === "scanning" ? "font-medium" : ""}>
                    AI analyzes your skin conditions
                  </span>
                </div>

                <div
                  className={`flex items-center ${
                    step === "results"
                      ? "text-primary-500"
                      : "text-secondary-400"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-current flex items-center justify-center mr-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span className={step === "results" ? "font-medium" : ""}>
                    Review your personalized analysis
                  </span>
                </div>
              </div>
            </div>

            {step === "capture" && (
              <div className="card">
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-secondary-600">
                        Logged in as:
                      </span>
                      <p className="font-medium">{userName}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                <div className="text-sm text-secondary-600">
                  <h4 className="font-medium text-secondary-700 mb-1">
                    For best results:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure good lighting on your face</li>
                    <li>Remove glasses and pull back hair</li>
                    <li>Face the camera directly</li>
                    <li>Maintain a neutral expression</li>
                  </ul>
                </div>

                {previousAnalyses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-secondary-700 mb-2">
                      Previous Analyses
                    </h4>
                    <p className="text-sm text-secondary-600 mb-2">
                      You have {previousAnalyses.length} previous skin{" "}
                      {previousAnalyses.length === 1 ? "analysis" : "analyses"}{" "}
                      saved.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3">
            <div className="card h-full">
              {step === "capture" && (
                <ImageCapture
                  onCapture={handleCapture}
                  capturedImage={capturedImage}
                />
              )}

              {step === "scanning" && capturedImage && (
                <ScanningProcess
                  imageUrl={capturedImage}
                  onAnalysisComplete={handleAnalysisComplete}
                  onError={handleAnalysisError}
                />
              )}

              {step === "results" && analysisData && capturedImage && (
                <AnalysisResults
                  analysisData={analysisData}
                  imageUrl={capturedImage}
                  userName={userName || "User"}
                  previousAnalyses={previousAnalyses.slice(0, -1)} // Exclude current analysis
                  previousImages={previousImages.slice(0, -1)} // Exclude current image
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div id="how-it-works" className="card mb-8">
        <h3 className="text-2xl font-serif font-bold text-primary-800 mb-4">
          How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mx-auto mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h4 className="font-serif font-semibold mb-2">Capture</h4>
            <p className="text-secondary-600 text-sm">
              Take a clear photo of your face using your device's camera or
              upload an existing image.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mx-auto mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h4 className="font-serif font-semibold mb-2">Analyze</h4>
            <p className="text-secondary-600 text-sm">
              Our AI technology analyzes your skin for up to 10 different
              conditions with high precision.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mx-auto mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="font-serif font-semibold mb-2">Report</h4>
            <p className="text-secondary-600 text-sm">
              Receive a detailed report with personalized recommendations that
              you can download and share.
            </p>
          </div>
        </div>
      </div>

      <div id="skin-conditions" className="card">
        <h3 className="text-2xl font-serif font-bold text-primary-800 mb-4">
          Skin Conditions We Detect
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              name: "Acne",
              description: "Inflamed sebaceous glands and hair follicles",
            },
            { name: "Dryness", description: "Lack of moisture in the skin" },
            { name: "Oiliness", description: "Excess sebum production" },
            { name: "Wrinkles", description: "Lines and creases in the skin" },
            {
              name: "Pigmentation",
              description: "Uneven skin tone and dark spots",
            },
            {
              name: "Rosacea",
              description: "Redness and visible blood vessels",
            },
            { name: "Eczema", description: "Inflamed, itchy, cracked skin" },
            {
              name: "Psoriasis",
              description: "Scaly patches and inflammation",
            },
            { name: "Melasma", description: "Brown or gray-brown patches" },
            { name: "Sensitivity", description: "Easily irritated skin" },
          ].map((condition, index) => (
            <div
              key={index}
              className="border border-primary-100 rounded-lg p-3 bg-primary-50"
            >
              <h4 className="font-serif font-semibold text-primary-700 mb-1">
                {condition.name}
              </h4>
              <p className="text-sm text-secondary-600">
                {condition.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
