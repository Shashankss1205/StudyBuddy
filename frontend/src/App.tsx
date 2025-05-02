import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  // Card,
  // CardContent,
  // CardMedia,
  // IconButton,
  Alert,
  LinearProgress,
  // Slider,
  // Stack,
  // Tooltip,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // List,
  // ListItem,
  // ListItemText,
  // Divider,
  // RadioGroup,
  // FormControlLabel,
  // Radio,
  // TextField,
  // Tabs,
  // Tab,
  // DialogContentText,
  // CardActions,
  // MenuItem,
  // Select,
  // FormControl,
  // InputLabel,
  // SelectChangeEvent,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
} from '@mui/material';
import { 
  CloudUpload, 
  // PlayArrow, 
  // Pause, 
  // VolumeUp, 
  // VolumeDown,
  // ZoomIn,
  // ZoomOut,
  // Send,
  // QuestionAnswer,
  // QuizOutlined,
  // DownloadForOffline,
  // CheckCircleOutlined,
  // ReplayOutlined,
  // SkipNextOutlined,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
// import SpeedIcon from '@mui/icons-material/Speed';
// import axios from 'axios';
// import { PageResult, QuizQuestion, ChatMessage } from './types';
// import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
// import ReplayIcon from '@mui/icons-material/Replay';
// import AlertDialog from './components/AlertDialog';
import ChatIcon from '@mui/icons-material/Chat';

// Custom components
import PDFUploadDialog from './components/PDFUploadDialog';
import QuizDialog from './components/QuizDialog';
import ChatDialog from './components/ChatDialog';
import ConfirmDialog from './components/ConfirmDialog';
import PageNavigation from './components/PageNavigation';
import ActionButtons from './components/ActionButtons';
import StudyView from './components/StudyView';

// Custom hooks
import { usePDFProcessing } from './hooks/usePDFProcessing';
import { useAudio } from './hooks/useAudio';
import { useQuiz } from './hooks/useQuiz';
import { useChat } from './hooks/useChat';
import { useZoom } from './hooks/useZoom';
import { useTheme } from './theme/ThemeProvider';

// interface ApiResponse {
//   total_pages: number;
//   pdf_name: string;
//   pages: {
//     page_number: number;
//     image: string;
//     explanation: string;
//     audio: string;
//     audio_url: string;
//     image_url: string;
//   }[];
// }

// Add some CSS styles at the top of the file, under the imports
// const markdownStyles = {
//   content: {
//     lineHeight: 1.6,
//     fontSize: '1rem',
//   },
//   h1: {
//     fontSize: '2rem',
//     marginTop: '1.5rem',
//     marginBottom: '0.5rem',
//     fontWeight: 600,
//     borderBottom: '1px solid #eaecef',
//     paddingBottom: '0.3rem',
//   },
//   h2: {
//     fontSize: '1.5rem',
//     marginTop: '1.5rem',
//     marginBottom: '0.5rem',
//     fontWeight: 600,
//     borderBottom: '1px solid #eaecef',
//     paddingBottom: '0.3rem',
//   },
//   h3: {
//     fontSize: '1.25rem',
//     marginTop: '1.5rem',
//     marginBottom: '0.5rem',
//     fontWeight: 600,
//   },
//   paragraph: {
//     marginTop: '1rem',
//     marginBottom: '1rem',
//   },
//   ul: {
//     paddingLeft: '2rem',
//     marginTop: '0.5rem',
//     marginBottom: '0.5rem',
//   },
//   ol: {
//     paddingLeft: '2rem',
//     marginTop: '0.5rem',
//     marginBottom: '0.5rem',
//   },
//   li: {
//     marginTop: '0.25rem',
//     marginBottom: '0.25rem',
//   },
//   code: {
//     fontFamily: 'monospace',
//     backgroundColor: '#f1f1f1',
//     padding: '2px 4px',
//     borderRadius: '3px',
//     fontSize: '0.9rem',
//   },
//   pre: {
//     fontFamily: 'monospace',
//     backgroundColor: '#f6f8fa',
//     padding: '1rem',
//     borderRadius: '5px',
//     overflow: 'auto',
//     fontSize: '0.9rem',
//     marginTop: '0.5rem',
//     marginBottom: '0.5rem',
//   },
//   mathFormula: {
//     fontFamily: 'serif',
//     fontStyle: 'italic',
//     padding: '0.25rem 0',
//     fontSize: '1.1rem',
//   },
//   strong: {
//     fontWeight: 700,
//   },
//   em: {
//     fontStyle: 'italic',
//   }
// };

function App() {
  // Get the theme toggle function
  const { mode, toggleThemeMode } = useTheme();

  // Use the PDF processing hook
  const {
    file,
    loading,
    results,
    currentPage,
    totalPages,
    progress,
    processingComplete,
    error,
    pdfName,
    existingPDFs,
    showPDFDialog,
    loadingExistingPDFs,
    confirmDialogOpen,
    existingVersions,
    selectedVersion,
    difficultyLevel,
    setDifficultyLevel,
    setFile,
    setCurrentPage,
    setSelectedVersion,
    setConfirmDialogOpen,
    fetchExistingPDFs,
    handleUseExistingPDF,
    handleFileChange,
    handleFileUpload,
    handleUpload,
    handleConfirmUseExisting,
    handleConfirmCreateNew,
    handleBackToUpload
  } = usePDFProcessing();

  // Use the audio hook
  const {
    audioRef,
    audioPlaying,
    isPaused,
    volume,
    playbackRate,
    setVolume,
    setPlaybackRate,
    handlePlayAudio,
    handleReplay
  } = useAudio(currentPage, results, pdfName);

  // Use the quiz hook
  const {
    quizOpen,
    quizQuestions,
    selectedAnswers,
    quizSubmitted,
    quizScore,
    loadingQuiz,
    setQuizOpen,
    setSelectedAnswers,
    generateQuiz,
    handleQuizSubmit,
    resetQuiz,
    downloadMaterials
  } = useQuiz(pdfName);

  // Use the chat hook
  const {
    isChatOpen,
    chatMessages,
    setIsChatOpen,
    setChatMessages,
    getCombinedPdfContext
  } = useChat(results);

  // Use the zoom hook
  const {
    zoomLevel,
    handleZoom
  } = useZoom();

  // Listen for nextPageAvailable event to handle automatic page navigation
  useEffect(() => {
    const handleNextPageAvailable = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { pageNumber } = customEvent.detail;
      
      console.log(`Next page ${pageNumber} is available, navigating to it`);
      
      // Navigate to the next page (adjusting for 0-based indexing)
      setCurrentPage(pageNumber - 1);
    };
    
    // Add event listener
    window.addEventListener('nextPageAvailable', handleNextPageAvailable);
    
    // Clean up
    return () => {
      window.removeEventListener('nextPageAvailable', handleNextPageAvailable);
    };
  }, [setCurrentPage]);

  // Debug logging for results and current page
  useEffect(() => {
    if (results.length > 0) {
      console.log(`App: ${results.length} pages available, current page: ${currentPage + 1}`);
      console.log(`Current page data:`, results[currentPage]);
    }
  }, [results, currentPage]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ flex: 1 }}>
            PDF Study Buddy
          </Typography>
          
          <IconButton onClick={toggleThemeMode} color="primary" sx={{ ml: 2 }}>
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
        
        {showPDFDialog ? (
          <PDFUploadDialog
            handleFileUpload={handleFileUpload}
            existingPDFs={existingPDFs}
            loadingExistingPDFs={loadingExistingPDFs}
            handleUseExistingPDF={handleUseExistingPDF}
            fetchExistingPDFs={fetchExistingPDFs}
            difficultyLevel={difficultyLevel}
            setDifficultyLevel={setDifficultyLevel}
          />
        ) : (
          <>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <input
                accept=".pdf"
                style={{ display: 'none' }}
                id="pdf-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="pdf-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Upload PDF
                </Button>
              </label>
              {file && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Selected file: {file.name}
                </Typography>
              )}
              
              {/* Difficulty level selector */}
              <Box sx={{ width: '100%', maxWidth: 300, mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="difficulty-select-label">Explanation Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-select-label"
                    id="difficulty-select"
                    value={difficultyLevel}
                    label="Explanation Difficulty"
                    onChange={(e) => setDifficultyLevel(e.target.value as 'beginner' | 'intermediate' | 'detailed')}
                  >
                    <MenuItem value="beginner">Beginner (Simplified)</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="detailed">Detailed (Advanced)</MenuItem>
                  </Select>
                  <FormHelperText>Choose how detailed you want the explanations to be</FormHelperText>
                </FormControl>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!file || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Process PDF'}
              </Button>
            </Paper>

            {loading && totalPages > 0 && (
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  Processing page {progress} of {totalPages}
                </Typography>
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress variant="determinate" value={(progress / totalPages) * 100} />
                </Box>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {results.length > 0 && (
              <>
                {/* Action Buttons */}
                {processingComplete && (
                  <ActionButtons
                    setIsChatOpen={setIsChatOpen}
                    generateQuiz={generateQuiz}
                    downloadMaterials={downloadMaterials}
                    loadingQuiz={loadingQuiz}
                  />
                )}

                {/* Page Navigation */}
                <PageNavigation
                  currentPage={currentPage}
                  totalPages={results.length}
                  setCurrentPage={setCurrentPage}
                />

                {/* Main Content */}
                <StudyView
                  currentPage={currentPage}
                  results={results}
                  audioRef={audioRef}
                  audioPlaying={audioPlaying}
                  isPaused={isPaused}
                  volume={volume}
                  setVolume={setVolume}
                  playbackRate={playbackRate}
                  setPlaybackRate={setPlaybackRate}
                  handlePlayAudio={handlePlayAudio}
                  handleReplay={handleReplay}
                  zoomLevel={zoomLevel}
                  handleZoom={handleZoom}
                />

                {/* Dialogs */}
                <ChatDialog
                  isChatOpen={isChatOpen}
                  chatMessages={chatMessages}
                  setChatMessages={setChatMessages}
                  getCombinedPdfContext={getCombinedPdfContext}
                  setIsChatOpen={setIsChatOpen}
                />
                <QuizDialog
                  quizOpen={quizOpen}
                  quizQuestions={quizQuestions}
                  selectedAnswers={selectedAnswers}
                  quizSubmitted={quizSubmitted}
                  quizScore={quizScore}
                  setQuizOpen={setQuizOpen}
                  setSelectedAnswers={setSelectedAnswers}
                  handleQuizSubmit={handleQuizSubmit}
                  resetQuiz={resetQuiz}
                />
              </>
            )}
          </>
        )}

        {/* Confirm Dialog for existing PDF */}
        <ConfirmDialog
          confirmDialogOpen={confirmDialogOpen}
          existingVersions={existingVersions}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
          handleConfirmUseExisting={handleConfirmUseExisting}
          handleConfirmCreateNew={handleConfirmCreateNew}
          setConfirmDialogOpen={setConfirmDialogOpen}
        />
      </Box>

      {/* Floating Chat Button - Always visible except on PDF upload page */}
      {!showPDFDialog && (
        <Fab
          color="primary"
          aria-label="chat"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
          onClick={() => setIsChatOpen(true)}
        >
          <ChatIcon />
        </Fab>
      )}
    </Container>
  );
}

export default App;