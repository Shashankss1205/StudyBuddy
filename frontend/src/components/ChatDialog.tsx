import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import { Send } from '@mui/icons-material';
import axios from 'axios';
import { ChatMessage } from '../types';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

// ChatMessages component to handle message rendering separately
const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  // Use a callback ref instead of useEffect for scrolling
  const scrollToBottom = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (messages.length === 0) {
    return (
      <Typography color="textSecondary" align="center">
        Ask a question about any page in the document.
      </Typography>
    );
  }
  
  return (
    <>
      {messages.map((msg, index) => (
        <Box 
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            mb: 2
          }}
        >
          <Paper
            sx={{
              p: 1.5,
              maxWidth: '80%',
              bgcolor: msg.sender === 'user' ? 'primary.light' : 'background.default',
              color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2
            }}
          >
            <Typography variant="body1">
              {msg.content}
            </Typography>
          </Paper>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
            {new Date(msg.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      ))}
      {/* Use callback ref on an empty div at the end for auto-scrolling */}
      <div ref={scrollToBottom} />
    </>
  );
};

interface ChatDialogProps {
  isChatOpen: boolean;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  getCombinedPdfContext: () => string;
  setIsChatOpen: (open: boolean) => void;
}

const ChatDialog: React.FC<ChatDialogProps> = React.memo(({
  isChatOpen,
  chatMessages,
  setChatMessages,
  getCombinedPdfContext,
  setIsChatOpen
}) => {
  const [localChatInput, setLocalChatInput] = useState('');
  
  // Use a stable function reference for the close handler
  const handleClose = useCallback(() => {
    setIsChatOpen(false);
  }, [setIsChatOpen]);
  
  // Stable function for submitting chat
  const handleLocalChatSubmit = useCallback(() => {
    if (!localChatInput.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      content: localChatInput,
      sender: 'user',
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setLocalChatInput('');
    
    // Get the context from ALL pages
    const completeContext = getCombinedPdfContext();
    
    // Send to backend
    axios.post('http://localhost:5000/ask-question', {
      question: userMessage.content,
      context: completeContext
    })
    .then(response => {
      // Add AI response
      const aiMessage: ChatMessage = {
        content: response.data.answer,
        sender: 'ai',
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    })
    .catch(error => {
      console.error('Error getting answer:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        content: 'Sorry, there was an error processing your question.',
        sender: 'ai',
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    });
  }, [localChatInput, setChatMessages, getCombinedPdfContext]);
  
  // Handle input change with stable reference
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalChatInput(e.target.value);
  }, []);
  
  // Handle key press with stable reference
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocalChatSubmit();
    }
  }, [handleLocalChatSubmit]);

  return (
    <Dialog
      open={isChatOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      keepMounted
      TransitionProps={{
        unmountOnExit: false,
      }}
    >
      <DialogTitle>
        Ask Questions About This PDF
        <Typography variant="body2" color="textSecondary">
          You can ask questions about any part of the document
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box 
          sx={{
            height: '300px',
            overflowY: 'auto',
            mb: 2,
            p: 1,
            bgcolor: 'background.paper',
            borderRadius: 1
          }}
        >
          <ChatMessages messages={chatMessages} />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            label="Your question"
            variant="outlined"
            value={localChatInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <IconButton 
            color="primary"
            onClick={handleLocalChatSubmit}
            disabled={!localChatInput.trim()}
          >
            <Send />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ChatDialog; 