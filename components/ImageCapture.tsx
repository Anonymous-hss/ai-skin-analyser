// components/ImageCapture.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Camera } from "lucide-react";
import FaceDetectionCamera from "./FaceDetectionCamera";

interface ImageCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  capturedImage: string | null;
}

export default function ImageCapture({
  onCapture,
  capturedImage,
}: ImageCaptureProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [captureMethod, setCaptureMethod] = useState<
    "camera" | "upload" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      onCapture(result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    if (imageDataUrl) {
      onCapture(imageDataUrl);
    } else {
      // If empty string is passed, it means reset
      setCaptureMethod(null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        {captureMethod === null ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-center">
              Choose Capture Method
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setCaptureMethod("camera")}
                className="h-32 flex flex-col items-center justify-center"
                variant="outline"
              >
                <Camera className="h-8 w-8 mb-2" />
                <span>Use Camera</span>
              </Button>

              <Button
                onClick={() => setCaptureMethod("upload")}
                className="h-32 flex flex-col items-center justify-center"
                variant="outline"
              >
                <Upload className="h-8 w-8 mb-2" />
                <span>Upload Image</span>
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              For best results, use a well-lit environment and position your
              face directly in front of the camera.
            </p>
          </div>
        ) : captureMethod === "camera" ? (
          <FaceDetectionCamera
            onCapture={handleCameraCapture}
            capturedImage={capturedImage}
          />
        ) : (
          <div className="space-y-4">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-gray-100">
              {uploadedImage || capturedImage ? (
                <img
                  src={uploadedImage || capturedImage || ""}
                  alt="Uploaded face"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Click below to upload an image
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={triggerFileInput}
                variant="outline"
                className="flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploadedImage || capturedImage
                  ? "Choose Different Image"
                  : "Upload Image"}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <Button
              onClick={() => setCaptureMethod(null)}
              variant="link"
              className="w-full"
            >
              Back to Capture Methods
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
