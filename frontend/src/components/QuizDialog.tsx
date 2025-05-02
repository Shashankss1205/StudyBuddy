import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress
} from '@mui/material';
import { QuizQuestion } from '../types';

interface QuizDialogProps {
  quizOpen: boolean;
  quizQuestions: QuizQuestion[];
  selectedAnswers: Record<number, string>;
  quizSubmitted: boolean;
  quizScore: number | null;
  setQuizOpen: (open: boolean) => void;
  setSelectedAnswers: (answers: Record<number, string>) => void;
  handleQuizSubmit: () => void;
  resetQuiz: () => void;
}

const QuizDialog: React.FC<QuizDialogProps> = ({
  quizOpen,
  quizQuestions,
  selectedAnswers,
  quizSubmitted,
  quizScore,
  setQuizOpen,
  setSelectedAnswers,
  handleQuizSubmit,
  resetQuiz
}) => {
  console.log("Rendering QuizDialog. Quiz open:", quizOpen, "Questions:", quizQuestions.length);
  
  return (
    <Dialog
      open={quizOpen}
      onClose={() => setQuizOpen(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Quiz - Test Your Understanding
        {quizSubmitted && (
          <Typography color="primary" variant="h6" component="span" sx={{ ml: 2 }}>
            Score: {quizScore}/{quizQuestions.length}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {quizQuestions.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading quiz questions...</Typography>
          </Box>
        ) : (
          <List>
            {quizQuestions.map((question, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Box width="100%">
                    <Typography variant="h6" gutterBottom>
                      {index + 1}. {question.question}
                    </Typography>
                    
                    <RadioGroup
                      value={selectedAnswers[index] || ''}
                      onChange={(e) => {
                        if (!quizSubmitted) {
                          setSelectedAnswers({
                            ...selectedAnswers,
                            [index]: e.target.value
                          });
                        }
                      }}
                    >
                      {question.options.map((option, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          value={String.fromCharCode(65 + optIndex)} // A, B, C, D
                          control={<Radio />}
                          label={`${String.fromCharCode(65 + optIndex)}. ${option}`}
                          disabled={quizSubmitted}
                          sx={{
                            ...(quizSubmitted && 
                              String.fromCharCode(65 + optIndex) === question.correctAnswer && {
                                color: 'success.main',
                                fontWeight: 'bold'
                              }),
                            ...(quizSubmitted && 
                              selectedAnswers[index] === String.fromCharCode(65 + optIndex) && 
                              selectedAnswers[index] !== question.correctAnswer && {
                                color: 'error.main'
                              })
                          }}
                        />
                      ))}
                    </RadioGroup>
                    
                    {quizSubmitted && (
                      <Box mt={2} p={1} bgcolor="background.paper" borderRadius={1}>
                        <Typography color="textSecondary" variant="body2">
                          <strong>Explanation:</strong> {question.explanation}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </ListItem>
                {index < quizQuestions.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        {quizSubmitted ? (
          <>
            <Button onClick={resetQuiz} color="secondary">
              Retry Quiz
            </Button>
            <Button onClick={() => setQuizOpen(false)} color="primary">
              Close
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setQuizOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button 
              onClick={handleQuizSubmit} 
              color="primary"
              disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
            >
              Submit Answers
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuizDialog; 