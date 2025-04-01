/**
 * Deployment configuration for the AI Skin Analyzer
 * This file can be used with various deployment platforms
 */

const deployConfig = {
  // Application settings
  app: {
    name: "AI Skin Analyzer",
    description: "Advanced skin analysis tool with detailed reports and visualizations",
    version: "1.0.0",
  },

  // Build settings
  build: {
    command: "npm run build",
    outputDirectory: "dist",
    environment: "production",
  },

  // Deployment settings
  deploy: {
    // For Vercel deployment
    vercel: {
      regions: ["all"],
      framework: "vite",
    },

    // For Netlify deployment
    netlify: {
      publish: "dist",
      functions: "functions",
    },

    // For custom domain deployment
    customDomain: {
      // Replace with your actual domain
      domain: "your-domain.com",
      // Add your DNS settings here
      dns: [
        {
          type: "A",
          name: "@",
          value: "Your server IP",
        },
        {
          type: "CNAME",
          name: "www",
          value: "your-domain.com",
        },
      ],
    },
  },

  // Environment variables (do not include sensitive information here)
  env: {
    PUBLIC_API_URL: "/api",
  },
}

module.exports = deployConfig

