##BiasLens

BiasLens is an AI-powered web app that detects and explains different forms of language bias—such as gender bias, media bias, and social bias—in text. It highlights the type of bias, provides explanations, suggests inclusive rewrites, and displays confidence scores.

Features

Detects multiple types of bias (gender, media, social)
Provides structured AI-generated analysis
Parses AI responses into clearly formatted sections
Suggests inclusive rewrites for biased statements
Displays confidence scores with visual feedback
Supports Markdown formatting via react-markdown and remark-gfm
Includes a Bias Education tab to help users understand bias types
Tech Stack

Frontend

React
Material UI (MUI)
React Router
React Markdown (react-markdown + remark-gfm)
Backend (Expected)

Node.js + Express
AI API (Gemini / OpenAI)
MongoDB / Firestore for storage (optional)
Hosted on Cloud Run or Firebase Functions
Getting Started

Clone and Setup
git clone https://github.com/yourusername/biaslens.git
cd biaslens
npm install
Environment Variable
Create a .env file:

REACT_APP_API_URL=http://localhost:8080
This URL should point to the backend endpoint where the AI service is hosted.

Project Structure

src/
├── components/
│   ├── AnalysisForm.js          // Form UI for input
│   ├── AnalysisResults.js       // Handles parsed display
├── pages/
│   ├── AnalyzePage.js           // Route-based pages
│   ├── DocumentUploadPage.js    // Optional upload flow
├── utils/
│   └── parseAnalysis.js         // Parsing logic (inline in AnalysisResults for now)
Expected Backend API Design

Endpoint: /analyze-general
For detecting gender or social bias.

Endpoint: /analyze-media
For detecting media bias (including political leaning, framing, omission, selection bias).

Example Request
POST /analyze-media
{
  "text": "biden not educating ??"
}
Example Response
{
  "originalText": "biden not educating ??",
  "analysis": "1. **Political Leaning:** Right-leaning.\n\n2. **Types of Bias Detected:** Framing, Omission, Selection.\n\n3. **Explanation of the Bias:**\n\n* **Framing:** The question mark implies doubt...\n\n4. **Suggested Neutral Rewrite:**\n\n* Option 1: \"Debate Continues on Biden's Education Policies\"\n\n5. **Confidence Score:** 95",
  "timestamp": "2025-06-17T23:58:38.245Z"
}
AI Response Parsing Logic

In AnalysisResults.js, the AI's response is parsed using a custom function parseAnalysis() that:

Splits the AI’s markdown response by newlines
Looks for section headers such as:
1. Political Leaning:
2. Types of Bias Detected:
3. Explanation of the Bias:
4. Suggested Neutral Rewrite:
5. Confidence Score:
Each section is parsed and saved in state
Explanation bullets like * Framing: are parsed line by line and separated with styling
If no number is detected in the confidence score, a default tag such as appropriate or unsure is used.

Key Components

AnalysisForm.js: Handles text input and trigger
AnalysisResults.js: Formats AI analysis
Uses react-markdown as fallback
Displays parsed sections via MUI Chips and Typography
parseAnalysis(): Located within AnalysisResults.js. You can modularize it to utils/parseAnalysis.js if needed
Customization

You can easily:

Add more bias categories (e.g., political, racial)
Extend explanation parsing for heatmaps or sentiment
Replace chips with visual tags (e.g., word clouds)
Deployment

This app can be deployed on any static site hosting platform:

Firebase Hosting
npm run build
firebase deploy
Vercel
vercel deploy
