import { useState } from 'react';
import { ChatMessage } from '../types';
import { PageResult } from '../types';

export const useChat = (results: PageResult[]) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Function to get combined PDF context for chat
  const getCombinedPdfContext = () => {
    // Check if we have any results
    if (results.length === 0) {
      return "No PDF content has been loaded yet. Please upload a PDF first.";
    }
    
    // Combine explanations from all pages
    return results
      .map(page => `Page ${page.page_number}: ${page.explanation}`)
      .join('\n\n');
  };

  return {
    isChatOpen,
    chatMessages,
    setIsChatOpen,
    setChatMessages,
    getCombinedPdfContext
  };
}; 