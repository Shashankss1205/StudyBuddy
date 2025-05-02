import { useState } from 'react';
import axios from 'axios';
import { QuizQuestion } from '../types';

export const useQuiz = (pdfName: string) => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(0);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const generateQuiz = async () => {
    try {
      setLoadingQuiz(true);
      
      // Call the API to generate quiz with the correct PDF name
      const response = await axios.post<QuizQuestion[]>(`http://localhost:5000/generate-quiz/${pdfName}`);
      
      setQuizQuestions(response.data);
      setSelectedAnswers({});
      setQuizScore(null);
      setQuizOpen(true); // Open the quiz dialog instead of changing tabs
      setLoadingQuiz(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setLoadingQuiz(false);
    }
  };

  const handleQuizSubmit = () => {
    console.log("Submitting quiz answers:", selectedAnswers);
    
    // Check if all questions have been answered
    const answeredQuestions = Object.keys(selectedAnswers).length;
    if (answeredQuestions < quizQuestions.length) {
      alert(`Please answer all questions. You have answered ${answeredQuestions} of ${quizQuestions.length} questions.`);
      return;
    }
    
    // Calculate score
    let score = 0;
    quizQuestions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      console.log(`Question ${index + 1}: User answered ${userAnswer}, correct answer is ${question.correctAnswer}`);
      if (userAnswer === question.correctAnswer) {
        score++;
      }
    });
    
    console.log(`Final score: ${score}/${quizQuestions.length}`);
    setQuizScore(score);
    setQuizSubmitted(true);
  };
  
  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };
  
  const downloadMaterials = async () => {
    try {
      // Start the download with the correct PDF name
      window.open(`http://localhost:5000/download-materials/${pdfName}`, '_blank');
    } catch (error) {
      console.error('Error downloading materials:', error);
    }
  };

  return {
    quizOpen,
    quizQuestions,
    selectedAnswers,
    quizSubmitted,
    quizScore,
    loadingQuiz,
    setQuizOpen,
    setSelectedAnswers,
    setQuizQuestions,
    generateQuiz,
    handleQuizSubmit,
    resetQuiz,
    downloadMaterials
  };
}; 