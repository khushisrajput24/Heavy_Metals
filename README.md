#  Heavy Metals 

A web-based application that analyzes **heavy metal contamination** in water samples using **Machine Learning**, **Google Maps heatmaps**, and **automated reporting tools**.  
It helps identify polluted regions, calculate HMPI scores, and generate professional environmental assessment reports.

---

##  Features

-  Upload & analyze water quality datasets  
-  Heavy Metal Pollution Index (HPI) calculation  
-  KNN-based location similarity analysis  
-  Interactive heatmap using Google Maps API  
-  Automated PDF report generation  
-  Clean and user-friendly React UI  
-  FastAPI backend with ML preprocessing and prediction  

---

##  Installation Guide

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
Backend Setup
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## How to Use
1. Start the Application

Run the frontend and backend servers.

Open the frontend in your browser.

2. Upload Water Sample Data

Navigate to Dashboard → Upload Data
You can choose:

Manual Upload: enter metal concentrations one by one

Bulk Upload: upload a CSV file for batch analysis

3. View HMPI Analysis

Go to the Analysis page

See individual metal values, HMPI score, and contamination level

4. Explore Pollution on Map

Open the Map section

View heatmap of high-risk zones

Check location-based similarity using KNN

5. Generate Reports

Go to Reports → Generate PDF

Automatically creates:

HMPI score summary

Risk classification

Graphs & heatmap snapshots

Editable downloadable PDF

🛠️ Tech Stack

Frontend: React.js, Zustand, Tailwind
Backend: FastAPI (Python)
Machine Learning: Scikit-learn, Pandas, NumPy
Visualization: Google Maps API
Report Generation: jsPDF
Tools: VS Code, Google Colab

## File structure

```
Heavy_Metals/
│
├── frontend/
│   ├── node_modules/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── TextSizeContext.jsx
│   │   ├── pages/
│   │   │   ├── about_us.jsx
│   │   │   ├── analysis.jsx
│   │   │   ├── calculate.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── landing_page.jsx
│   │   │   ├── map.jsx
│   │   │   ├── not_found.jsx
│   │   │   ├── reports.jsx
│   │   │   └── settings.jsx
│   │   ├── store/
│   │   ├── utils/
│   │   │   ├── functions/
│   │   │   │   ├── apiUpload.js
│   │   │   │   ├── bulkUpload.js
│   │   │   │   ├── getReport.js
│   │   │   │   ├── manualUpload.js
│   │   │   │   └── utility.js
│   │   │   ├── constants.js
│   │   │   ├── declaration.jsx
│   │   │   ├── export.js
│   │   │   ├── reportsStore.jsx
│   │   │   └── riskData.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
│
├── backend/
│   ├── .venv/
│   ├── controllers/
│   │   ├── bulk.py
│   │   ├── hmpiCalc.py
│   │   └── suggestionsController.py
│   ├── dataset/
│   │   └── metal_remove_corpus.txt
│   ├── models/
│   │   ├── bulk_upload.pkl
│   │   ├── model_fixed.pkl
│   │   ├── model.pkl
│   │   ├── preprocessor_fixed.pkl
│   │   └── preprocessor.pkl
│   ├── load_old.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

### Contributing

Feel free to submit issues or pull requests to improve the system.

### By Team Solve321

