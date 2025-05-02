import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import { ExistingPDF } from '../types';
import { DifficultyLevel } from '../hooks/usePDFProcessing';

interface PDFUploadDialogProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, difficulty?: DifficultyLevel) => void;
  existingPDFs: ExistingPDF[];
  loadingExistingPDFs: boolean;
  handleUseExistingPDF: (pdfName: string) => void;
  fetchExistingPDFs: () => void;
  difficultyLevel?: DifficultyLevel;
  setDifficultyLevel?: (level: DifficultyLevel) => void;
}

const PDFUploadDialog: React.FC<PDFUploadDialogProps> = ({ 
  handleFileUpload, 
  existingPDFs, 
  loadingExistingPDFs,
  handleUseExistingPDF,
  fetchExistingPDFs,
  difficultyLevel = 'intermediate',
  setDifficultyLevel
}) => {
  const [localDifficulty, setLocalDifficulty] = useState<DifficultyLevel>(difficultyLevel);

  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    const newDifficulty = event.target.value as DifficultyLevel;
    setLocalDifficulty(newDifficulty);
    if (setDifficultyLevel) {
      setDifficultyLevel(newDifficulty);
    }
  };

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, localDifficulty);
  };

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          height: '350px', // Increased height to accommodate difficulty selector
          justifyContent: 'center',
          mb: 2
        }}
      >
        <Typography variant="h6" gutterBottom>
          Upload a PDF to explain
        </Typography>

        {/* Difficulty level selector */}
        <FormControl sx={{ m: 2, minWidth: 250 }}>
          <InputLabel id="difficulty-select-label">Explanation Difficulty</InputLabel>
          <Select
            labelId="difficulty-select-label"
            id="difficulty-select"
            value={localDifficulty}
            label="Explanation Difficulty"
            onChange={handleDifficultyChange}
          >
            <MenuItem value="beginner">Beginner (Simplified)</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="detailed">Detailed (Advanced)</MenuItem>
          </Select>
          <FormHelperText>Choose how detailed you want the explanations to be</FormHelperText>
        </FormControl>

        <input
          type="file"
          accept=".pdf"
          onChange={handlePDFUpload}
          style={{ display: 'none' }}
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload">
          <Button variant="contained" component="span" sx={{ mt: 2 }}>
            Select PDF
          </Button>
        </label>
      </Paper>
      
      {/* Display existing PDFs */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Previously Processed PDFs {existingPDFs.length > 0 ? `(${existingPDFs.length})` : '(None Found)'}
        <Button 
          variant="outlined" 
          size="small" 
          onClick={fetchExistingPDFs}
          sx={{ ml: 2 }}
        >
          Refresh List
        </Button>
      </Typography>
      
      {loadingExistingPDFs ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      ) : existingPDFs.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {existingPDFs.map((pdf) => (
            <Card key={pdf.name} sx={{ width: 250 }}>
              <CardContent>
                <Typography variant="h6" component="div" noWrap title={pdf.original_filename}>
                  {pdf.original_filename}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pages: {pdf.total_pages}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Processed: {pdf.date_processed}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleUseExistingPDF(pdf.name)}>
                  Use This PDF
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No previously processed PDFs found
        </Typography>
      )}
    </Box>
  );
};

export default PDFUploadDialog; 