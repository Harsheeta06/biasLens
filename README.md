# BiasLens

**BiasLens** is an AI-powered web app that detects and explains different forms of language bias—such as **gender bias**, **media bias**, and **social bias**—in text. It highlights the type of bias, provides explanations, suggests inclusive rewrites, and displays confidence scores.

This proect was built as part of the Google AI in action hackathon

---

##  Features

- Detects multiple types of bias (gender, media, social)
- Provides structured AI-generated analysis
- Parses AI responses into clearly formatted sections
- Suggests inclusive rewrites for biased statements
- Displays confidence scores 

---

##  Tech Stack

### Frontend

- React
- Material UI (MUI)
- React Router DOM
- `react-markdown` + `remark-gfm`

### Backend (Expected/Optional)

- Node.js + Express
- AI APIs (Gemini or OpenAI)
- MongoDB Atlas or Firebase Firestore
- Hosted on Google Cloud Run or Firebase Functions

---
##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/biaslens.git
cd biaslens
npm install
```

### 2. Set Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080
```

This should point to your local or deployed backend.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AnalysisForm.js           # Text input and submit UI
│   ├── AnalysisResults.js        # Formatted result rendering
├── pages/
│   ├── AnalyzePage.js            # Main route for live analysis
│   ├── DocumentUploadPage.js     # (Optional) Upload-based entry point
├── utils/
│   └── parseAnalysis.js          # AI response parsing logic (can be moved out of AnalysisResults.js)
```

---

##  API Endpoints (Expected)

### POST `/analyze-general`

Detects **gender** or **social bias** in freeform text.

### POST `/analyze-media`

Detects **media bias**: framing, omission, selection, and political leaning.

---

## 🧩 Key Components

| File                  | Purpose                                      |
|-----------------------|----------------------------------------------|
| `AnalysisForm.js`     | Form UI that sends requests to the backend   |
| `AnalysisResults.js`  | Parses and displays the analysis             |
| `parseAnalysis()`     | Logic to convert AI markdown to UI-friendly JSON |

---

## 🛠 Customization Ideas

- Add more detailed bias types (racial, political, algorithmic)
- Display bias heatmaps for each sentence
- Enable PDF export or shareable links
- Hook into Google Sheets or Airtable for review queues

---

## 📦 Deployment

This is a frontend app that i have deployed on firebase hosting with backend deployed on cloud run. Utilized firestore and MongoDB. 

### Firebase Hosting

```bash
npm run build
firebase deploy
```
---

## 📅 Future Roadmap

- Chrome Extension: Bias detection in real-time while browsing
- Document upload (PDF, DOCX) with full-body bias detection
- Visual insights (charts, heatmaps, word clouds)
- User accounts and saved analysis dashboard

---

## License

This project is licensed under the MIT License.
