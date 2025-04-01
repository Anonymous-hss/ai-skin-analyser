// scripts/download-face-models.js
const fs = require("fs");
const path = require("path");
const https = require("https");

const modelsDir = path.join(__dirname, "../public/models");

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log("Created models directory");
}

// Models to download
const models = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
];

// Base URL for models
const baseUrl =
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/";

// Download each model
models.forEach((model) => {
  const filePath = path.join(modelsDir, model);
  const fileUrl = baseUrl + model;

  console.log(`Downloading ${model}...`);

  const file = fs.createWriteStream(filePath);
  https
    .get(fileUrl, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Downloaded ${model}`);
      });
    })
    .on("error", (err) => {
      fs.unlink(filePath);
      console.error(`Error downloading ${model}: ${err.message}`);
    });
});

console.log("Done!");
