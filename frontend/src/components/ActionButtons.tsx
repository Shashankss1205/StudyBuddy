import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { QuestionAnswer, QuizOutlined, DownloadForOffline } from '@mui/icons-material';

interface ActionButtonsProps {
  setIsChatOpen: (open: boolean) => void;
  generateQuiz: () => void;
  downloadMaterials: () => void;
  loadingQuiz: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  setIsChatOpen,
  generateQuiz,
  downloadMaterials,
  loadingQuiz
}) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <Button 
        variant="outlined" 
        startIcon={<QuestionAnswer />}
        onClick={() => setIsChatOpen(true)}
      >
        Chat
      </Button>
      <Button 
        variant="outlined" 
        startIcon={loadingQuiz ? <CircularProgress size={20} /> : <QuizOutlined />}
        onClick={generateQuiz}
        disabled={loadingQuiz}
      >
        {loadingQuiz ? "Loading Quiz..." : "Generate Quiz"}
      </Button>
      <Button 
        variant="outlined"
        startIcon={<DownloadForOffline />}
        onClick={downloadMaterials}
      >
        Download Materials
      </Button>
    </Box>
  );
};

export default ActionButtons; 