// components/FaceDetectionCamera.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface FaceDetectionCameraProps {
  onCapture: (imageDataUrl: string) => void;
  capturedImage: string | null;
}

export default function FaceDetectionCamera({
  onCapture,
  capturedImage,
}: FaceDetectionCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceAligned, setFaceAligned] = useState(false);
  const [faceMessage, setFaceMessage] = useState("Initializing camera...");
  const [detectionInterval, setDetectionInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setIsModelLoaded(true);
        console.log("Face detection models loaded");
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    };

    loadModels();

    return () => {
      // Clean up detection interval
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, []);

  // Start face detection when camera is active and models are loaded
  useEffect(() => {
    if (
      isCameraActive &&
      isModelLoaded &&
      webcamRef.current &&
      canvasRef.current
    ) {
      setFaceMessage("Looking for your face...");

      const interval = setInterval(async () => {
        if (webcamRef.current && canvasRef.current) {
          const video = webcamRef.current.video;
          if (!video) return;

          // Only run detection if video is playing
          if (video.readyState === 4) {
            const canvas = canvasRef.current;
            const displaySize = {
              width: video.videoWidth,
              height: video.videoHeight,
            };

            // Match canvas size to video
            if (
              canvas.width !== displaySize.width ||
              canvas.height !== displaySize.height
            ) {
              faceapi.matchDimensions(canvas, displaySize);
            }

            // Detect faces
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks();

            // Clear previous drawings
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            if (detections.length === 0) {
              setFaceDetected(false);
              setFaceAligned(false);
              setFaceMessage(
                "No face detected. Please position your face in the frame."
              );
              return;
            }

            if (detections.length > 1) {
              setFaceDetected(true);
              setFaceAligned(false);
              setFaceMessage(
                "Multiple faces detected. Please ensure only your face is in the frame."
              );
              return;
            }

            // We have exactly one face
            setFaceDetected(true);

            const detection = detections[0];
            const resizedDetection = faceapi.resizeResults(
              detection,
              displaySize
            );

            // Draw face frame
            if (ctx) {
              // Draw oval face guide
              const box = resizedDetection.detection.box;
              const centerX = box.x + box.width / 2;
              const centerY = box.y + box.height / 2;
              const radiusX = box.width * 0.7;
              const radiusY = box.height * 0.9;

              ctx.strokeStyle = "#4ade80"; // Green
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.ellipse(
                centerX,
                centerY,
                radiusX,
                radiusY,
                0,
                0,
                2 * Math.PI
              );
              ctx.stroke();

              // Check if face is properly aligned
              const idealWidth = canvas.width * 0.5;
              const idealHeight = canvas.height * 0.6;
              const idealX = (canvas.width - idealWidth) / 2;
              const idealY = (canvas.height - idealHeight) / 3;

              // Draw ideal position rectangle (for debugging)
              ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
              ctx.lineWidth = 2;
              ctx.strokeRect(idealX, idealY, idealWidth, idealHeight);

              // Check if face is within ideal position
              const isAligned =
                box.x >= idealX - idealWidth * 0.1 &&
                box.x + box.width <= idealX + idealWidth + idealWidth * 0.1 &&
                box.y >= idealY - idealHeight * 0.1 &&
                box.y + box.height <=
                  idealY + idealHeight + idealHeight * 0.1 &&
                box.width >= idealWidth * 0.7 &&
                box.width <= idealWidth * 1.3;

              setFaceAligned(isAligned);

              if (isAligned) {
                setFaceMessage("Perfect! Your face is properly positioned.");
              } else {
                // Provide specific guidance
                let message = "Adjust your position: ";

                if (box.width < idealWidth * 0.7) {
                  message += "Move closer to the camera. ";
                } else if (box.width > idealWidth * 1.3) {
                  message += "Move further from the camera. ";
                }

                if (box.x < idealX - idealWidth * 0.1) {
                  message += "Move right. ";
                } else if (
                  box.x + box.width >
                  idealX + idealWidth + idealWidth * 0.1
                ) {
                  message += "Move left. ";
                }

                if (box.y < idealY - idealHeight * 0.1) {
                  message += "Move down. ";
                } else if (
                  box.y + box.height >
                  idealY + idealHeight + idealHeight * 0.1
                ) {
                  message += "Move up. ";
                }

                setFaceMessage(message);
              }
            }
          }
        }
      }, 100);

      setDetectionInterval(interval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isCameraActive, isModelLoaded]);

  const startCamera = () => {
    setIsCameraActive(true);
  };

  const captureImage = useCallback(() => {
    if (!webcamRef.current || !faceDetected || !faceAligned) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      setIsCameraActive(false);

      // Clean up detection interval
      if (detectionInterval) {
        clearInterval(detectionInterval);
        setDetectionInterval(null);
      }
    }
  }, [webcamRef, faceDetected, faceAligned, onCapture, detectionInterval]);

  const retakeImage = () => {
    onCapture("");
    setIsCameraActive(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-900">
        {isCameraActive ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "user",
                width: 720,
                height: 960,
              }}
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Face detection message */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    faceDetected
                      ? faceAligned
                        ? "bg-green-500"
                        : "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <p>{faceMessage}</p>
              </div>
            </div>
          </>
        ) : capturedImage ? (
          <img
            src={capturedImage || "/placeholder.svg"}
            alt="Captured face"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white">
            <Camera className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center px-4">
              Click "Start Camera" to begin face detection and capture your
              image.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        {!isCameraActive && !capturedImage && (
          <Button onClick={startCamera} className="flex items-center">
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        )}

        {isCameraActive && (
          <Button
            onClick={captureImage}
            disabled={!faceDetected || !faceAligned}
            className="flex items-center"
            variant={faceDetected && faceAligned ? "default" : "outline"}
          >
            <Camera className="mr-2 h-4 w-4" />
            {faceDetected && faceAligned ? "Capture" : "Align Face to Capture"}
          </Button>
        )}

        {capturedImage && (
          <Button
            onClick={retakeImage}
            variant="outline"
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" />
            Retake
          </Button>
        )}
      </div>
    </div>
  );
}
