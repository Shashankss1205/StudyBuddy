import { useState, useRef, useEffect } from 'react';
import { PageResult } from '../types';

export const useAudio = (currentPage: number, results: PageResult[], pdfName: string) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Reference to the current audio file being played
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Store state of received pages with audio to handle automatic navigation
  const receivedPagesRef = useRef<Set<number>>(new Set());

  // Handle keyboard controls for audio
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when not typing in an input field
      if (!['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
        switch (event.code) {
          case 'Space':
            event.preventDefault(); // Prevent page scroll
            if (audioRef.current && results[currentPage]) {
              handlePlayAudio(
                results[currentPage].audio || '',
                results[currentPage].audio_url || ''
              );
            }
            break;
          case 'ArrowLeft':
            event.preventDefault();
            if (audioRef.current) {
              audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
            }
            break;
          case 'ArrowRight':
            event.preventDefault();
            if (audioRef.current) {
              audioRef.current.currentTime = Math.min(
                audioRef.current.duration,
                audioRef.current.currentTime + 5
              );
            }
            break;
          case 'ArrowUp':
            event.preventDefault();
            if (audioRef.current) {
              setVolume(Math.min(1, volume + 0.1));
            }
            break;
          case 'ArrowDown':
            event.preventDefault();
            if (audioRef.current) {
              setVolume(Math.max(0, volume - 0.1));
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, results, audioPlaying, isPaused, volume]);

  // Reset audio when currentPage or pdfName changes
  useEffect(() => {
    console.log(`Page or PDF changed - page: ${currentPage}, pdf: ${pdfName}`);
    
    // Always reset audio when changing pages or PDFs
    if (audioRef.current) {
      console.log("Stopping and cleaning up audio on page/PDF change");
      audioRef.current.pause();
      audioRef.current.src = ''; // Clear the source
      audioRef.current = null;
      setAudioPlaying(false);
      setIsPaused(false);
    }
    
    // Check if the current page data exists and has audio
    if (results[currentPage]?.audio || results[currentPage]?.audio_url) {
      console.log(`Auto-playing audio for page ${currentPage + 1}`);
      handlePlayAudio(
        results[currentPage].audio || '',
        results[currentPage].audio_url || ''
      );
    }
  }, [currentPage, pdfName, results]);

  // Update volume and playback rate when they change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  // Listen for page ready events to handle audio and navigation
  useEffect(() => {
    // First page is special - always auto-play when it's ready
    const handleFirstPageReady = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { audioData, audioUrl } = customEvent.detail;
      
      console.log("First page ready, auto-playing audio");
      handlePlayAudio(audioData, audioUrl);
    };

    // Handle when any page becomes ready with audio
    const handlePageReady = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { pageNumber, pageIndex, audioData, audioUrl } = customEvent.detail;
      
      console.log(`Page ${pageNumber} is ready with audio`);
      
      // Add this page to our set of received pages
      receivedPagesRef.current.add(pageIndex);
      
      // If this is the current page and we don't have audio playing yet, auto-play it
      if (pageIndex === currentPage && (!audioRef.current || (!audioPlaying && !isPaused))) {
        console.log(`Auto-playing audio for newly received page ${pageNumber}`);
        handlePlayAudio(audioData, audioUrl);
      }
      
      // If audio for current page has finished, advance to the next page if it's available
      if (pageIndex === currentPage + 1 && (!audioPlaying && !isPaused && audioRef.current)) {
        console.log(`Current page audio finished, advancing to next page ${pageNumber}`);
        // Notify App component to advance to next page
        window.dispatchEvent(new CustomEvent('nextPageAvailable', {
          detail: { pageNumber }
        }));
      }
    };
    
    // Handle automatic page navigation when audio finishes
    const handleNextPageAvailable = (event: Event) => {
      // We don't need to do anything here in the useAudio hook,
      // the App component will handle the actual page change
      console.log("Next page available event received in useAudio");
    };
    
    // Add the event listeners
    window.addEventListener('firstPageReady', handleFirstPageReady);
    window.addEventListener('pageReady', handlePageReady);
    window.addEventListener('nextPageAvailable', handleNextPageAvailable);
    
    // Clean up
    return () => {
      window.removeEventListener('firstPageReady', handleFirstPageReady);
      window.removeEventListener('pageReady', handlePageReady);
      window.removeEventListener('nextPageAvailable', handleNextPageAvailable);
    };
  }, [currentPage, audioPlaying, isPaused]);

  const handlePlayAudio = (audioData: string, audioUrl?: string) => {
    console.log("handlePlayAudio called for page:", currentPage);
    
    // Check if we already have an audio player for current page
    const isCurrentPageAudio = audioRef.current && 
      ((audioUrl && audioRef.current.src.includes(audioUrl.split('?')[0])) || 
       (!audioUrl && audioRef.current.src.includes('data:audio/mp3;base64')));
    
    // If we're playing audio for current page, handle play/pause toggle
    if (isCurrentPageAudio && audioRef.current) {
      if (audioPlaying) {
        // If playing, pause it
        console.log("Pausing current audio");
        audioRef.current.pause();
        setAudioPlaying(false);
        setIsPaused(true);
      } else {
        // If paused, resume
        console.log("Resuming current audio");
        audioRef.current.play()
          .then(() => {
            setAudioPlaying(true);
            setIsPaused(false);
          })
          .catch(err => console.error("Error resuming audio:", err));
      }
      return;
    }
    
    // If we're here, we need to create a new audio element
    console.log("Creating new audio element");
    
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    // Create a new audio element
    let audio: HTMLAudioElement;
    
    // Use the audio URL if available, otherwise use base64 data
    if (audioUrl) {
      // Add a cache-busting parameter to force reload
      const cacheBuster = `?t=${Date.now()}`;
      audio = new Audio(`http://localhost:5000${audioUrl}${cacheBuster}`);
    } else if (audioData) {
      audio = new Audio(`data:audio/mp3;base64,${audioData}`);
    } else {
      console.error("No audio data or URL provided");
      return;
    }
    
    // Store the page number this audio is for
    audio.dataset.page = currentPage.toString();
    
    // Set volume and playback rate
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    
    // Save the audio element reference
    audioRef.current = audio;
    
    // Play the audio
    audio.play()
      .then(() => {
        console.log(`Audio playing successfully for page ${currentPage}`);
        setAudioPlaying(true);
        setIsPaused(false);
      })
      .catch(err => {
        console.error("Error playing audio:", err);
      });

    // Handle playback completion
    audio.onended = () => {
      console.log("Audio playback ended");
      setAudioPlaying(false);
      setIsPaused(false);
      
      // Check if next page is available
      const nextPageIndex = currentPage + 1;
      if (results[nextPageIndex]) {
        console.log("Next page already available, notifying for navigation");
        const nextPageEvent = new CustomEvent('nextPageAvailable', {
          detail: { pageNumber: nextPageIndex + 1 } // Convert to 1-based for consistency
        });
        window.dispatchEvent(nextPageEvent);
      } else if (receivedPagesRef.current.has(nextPageIndex)) {
        // If we've received the page but it's not yet in results array
        console.log("Next page received but not in results, notifying anyway");
        const nextPageEvent = new CustomEvent('nextPageAvailable', {
          detail: { pageNumber: nextPageIndex + 1 }
        });
        window.dispatchEvent(nextPageEvent);
      }
    };
  };

  const handleReplay = () => {
    console.log("Replaying audio for current page");
    
    // Always stop any current audio and create a new instance for the current page
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    // Set states to show we're creating a new audio
    setAudioPlaying(false);
    setIsPaused(false);
    audioRef.current = null;
    
    // Create a new audio instance for the current page
    const currentPageData = results[currentPage];
    if (currentPageData) {
      handlePlayAudio(
        currentPageData.audio || '',
        currentPageData.audio_url || ''
      );
    } else {
      console.error("Cannot replay - no data for current page");
    }
  };

  return {
    audioRef,
    audioPlaying,
    isPaused,
    volume,
    playbackRate,
    setVolume,
    setPlaybackRate,
    handlePlayAudio,
    handleReplay
  };
};