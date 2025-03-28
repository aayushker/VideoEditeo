'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mantine/core';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Timeline from './components/Timeline';
import Toolbar from './components/Toolbar';
import UploadDialog from './components/UploadDialog';

export default function Home() {
  const [projectName, setProjectName] = useState('My Video Project');
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 360 }); // 16:9 aspect ratio
  
  const timeoutRef = useRef(null);
  
  const selectedMedia = mediaItems.find(item => item.id === selectedMediaId);
  
  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 0.1;
          if (newTime >= 60) {
            setIsPlaying(false);
            return 0;
          }
          return parseFloat(newTime.toFixed(1));
        });
      }, 100);
    } else {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    }
    
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [isPlaying]);
  
  // Handle media upload
  const handleMediaUpload = (newMedia) => {
    setMediaItems(prev => [...prev, newMedia]);
    setSelectedMediaId(newMedia.id);
  };
  
  // Update media item properties
  const handleMediaUpdate = (id, updatedMedia) => {
    setMediaItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updatedMedia } : item)
    );
  };
  
  // Update position of media item
  const handlePositionChange = (id, newPosition) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, position: newPosition } 
          : item
      )
    );
  };
  
  // Update size of media item
  const handleSizeChange = (id, width, height) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, width, height } 
          : item
      )
    );
  };
  
  // Show empty state if no media items
  if (mediaItems.length === 0 && !showUploadDialog) {
    return (
      <div className="video-editor">
        <Box 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100vh',
            width: '100%',
            textAlign: 'center',
            padding: 20
          }}
        >
          <h1>Start by adding media to your project</h1>
          <p style={{ marginBottom: 20 }}>Upload images or videos to begin editing</p>
          <Button 
            size="lg" 
            onClick={() => setShowUploadDialog(true)}
          >
            Upload Media
          </Button>
          <UploadDialog 
            opened={showUploadDialog} 
            onClose={() => setShowUploadDialog(false)} 
            onUpload={handleMediaUpload}
          />
        </Box>
      </div>
    );
  }
  
  return (
    <div className="video-editor">
      <Sidebar
        selectedMedia={selectedMedia}
        onMediaUpdate={handleMediaUpdate}
        onMediaUpload={handleMediaUpload}
      />
      
      <div className="main-content">
        <Toolbar 
          projectName={projectName} 
          setProjectName={setProjectName} 
        />
        
        <Canvas
          mediaItems={mediaItems}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onPositionChange={handlePositionChange}
          onSizeChange={handleSizeChange}
          selectedMediaId={selectedMediaId}
          onSelectMedia={setSelectedMediaId}
          canvasSize={canvasSize}
        />
        
        <Timeline
          mediaItems={mediaItems}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onPlayPause={setIsPlaying}
          onTimeUpdate={setCurrentTime}
          onSelectMedia={setSelectedMediaId}
          selectedMediaId={selectedMediaId}
        />
      </div>
      
      <UploadDialog 
        opened={showUploadDialog} 
        onClose={() => setShowUploadDialog(false)} 
        onUpload={handleMediaUpload}
      />
    </div>
  );
}
