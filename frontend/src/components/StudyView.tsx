import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Paper,
  Tabs,
  Tab,
  Skeleton,
  CircularProgress
} from '@mui/material';
import AudioPlayer from './AudioPlayer';
import PDFViewer from './PDFViewer';
import { PageResult } from '../types';
import { formatText } from '../utils/formatUtils';

interface StudyViewProps {
  currentPage: number;
  results: PageResult[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioPlaying: boolean;
  isPaused: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  handlePlayAudio: (audioData: string, audioUrl?: string) => void;
  handleReplay: () => void;
  zoomLevel: number;
  handleZoom: (direction: 'in' | 'out') => void;
}

const StudyView: React.FC<StudyViewProps> = ({
  currentPage,
  results,
  audioRef,
  audioPlaying,
  isPaused,
  volume,
  setVolume,
  playbackRate,
  setPlaybackRate,
  handlePlayAudio,
  handleReplay,
  zoomLevel,
  handleZoom
}) => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const currentPageData = results[currentPage];
  const isPageLoaded = Boolean(currentPageData);

  // This log helps debug when pages are being rendered
  React.useEffect(() => {
    if (isPageLoaded) {
      console.log(`StudyView rendering page ${currentPage + 1} (${results.length} pages available)`);
      console.log(`Page data:`, currentPageData);
    } else {
      console.log(`StudyView waiting for page ${currentPage + 1} data`);
    }
  }, [currentPage, isPageLoaded, results.length, currentPageData]);

  return (
    <div>
      {/* Content Tabs */}
      <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Study Mode" />
        <Tab label="Explanation Only" />
      </Tabs>

      {currentTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card>
              {/* PDF Viewer */}
              {isPageLoaded ? (
                <PDFViewer
                  currentPage={currentPage}
                  results={results}
                  zoomLevel={zoomLevel}
                  handleZoom={handleZoom}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: '70vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(0,0,0,0.05)'
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Page {currentPageData?.page_number || currentPage + 1}
                </Typography>
                
                <AudioPlayer
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
                />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: '80vh' }}>
              <Typography variant="h6" gutterBottom>
                Explanation
              </Typography>
              {/* Render the explanation with proper formatting */}
              <div className="markdown-content" style={{ 
                maxHeight: '70vh', 
                overflowY: 'auto',
                padding: '0 1rem'
              }}>
                {isPageLoaded ? (
                  formatText(currentPageData.explanation)
                ) : (
                  <>
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="text" height={30} />
                  </>
                )}
              </div>
            </Paper>
          </Box>
        </Box>
      )}

      {currentTab === 1 && (
        <Paper sx={{ p: 3, height: '100vh' }}>
          <Typography variant="h6" gutterBottom>
            Explanation for Page {currentPageData?.page_number || currentPage + 1}
          </Typography>
          <div className="markdown-content" style={{ 
            maxHeight: '70vh', 
            overflowY: 'auto',
            padding: '0 1rem'
          }}>
            {isPageLoaded ? (
              formatText(currentPageData.explanation)
            ) : (
              <>
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
              </>
            )}
          </div>
          <Box sx={{ mt: 3 }}>
            <AudioPlayer
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
            />
          </Box>
        </Paper>
      )}
    </div>
  );
};

export default StudyView; 