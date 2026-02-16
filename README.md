# StudyBuddy - AI PDF Explainer

StudyBuddy is an application that helps students study more effectively by turning PDFs into interactive study materials with AI-generated explanations, audio narration, quizzes, and more.

## Features

- **Upload PDFs**: Upload any PDF to be processed by the AI.
- **AI Explanations**: Get page-by-page explanations of the content, including formulas and diagrams.
- **Text-to-Speech**: Listen to audio narrations of the explanations.
- **Interactive Controls**: Adjust audio playback speed, volume, rewind, and time scrubbing.
- **Q&A Chatbot**: Ask questions about the content and get AI-powered answers.
- **Quiz Generation**: Automatically generate quizzes to test your knowledge.
- **Material Downloads**: Download all generated content as a ZIP file for offline study.
- **PDF Caching**: Previously processed PDFs are cached for quick access.

## Folder Structure

```
StudyBuddy/
├── backend/                # Python Flask backend
│   ├── app.py              # Main server file
│   └── uploads/            # Contains processed PDFs
│       └── [pdf_name]/     # Folder for each processed PDF
│           ├── metadata.json
│           ├── original.pdf
│           ├── image_files/ # Page images
│           │   └── [pdf_name]_page_[page_num].jpg
│           ├── text_files/  # Markdown explanations
│           │   └── [pdf_name]_page_[page_num].md
│           ├── audio_files/ # Audio narrations
│           │   └── [pdf_name]_page_[page_num].mp3
│           └── quiz_data/   # Generated quizzes
│               └── [pdf_name]_quiz.json
│
└── frontend/               # React frontend
    ├── public/
    └── src/
        ├── App.tsx         # Main application component
        ├── components/     # UI components
        └── types.ts        # TypeScript type definitions
```

## Running the Application

### Backend

1. Install dependencies:
   ```bash
   pip install flask flask-cors pdf2image pillow google-generativeai python-dotenv
   ```

2. Create a `.env` file in the backend directory with your Google API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the backend server:
   ```bash
   cd backend
   python app.py
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the frontend application:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Upload a PDF using the "Select PDF" button on the home page.
2. StudyBuddy will process each page, generating explanations and audio narrations.
3. Use the tabs to navigate between:
   - **View**: Read and listen to the explanations
   - **Chat**: Ask questions about the content
   - **Quiz**: Test your understanding with automatically generated quizzes
4. Use the download button to get all materials as a ZIP file for offline study.
5. Previously processed PDFs will appear on the home page for quick access.

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Axios

- Backend:
  - Python
  - Flask
  - Google Gemini AI
  - ElevenLabs API
  - pdf2image
  - Pillow

## License

MIT 
