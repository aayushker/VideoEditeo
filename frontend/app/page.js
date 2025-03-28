'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Loader, Center, Text } from '@mantine/core';
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
  const [isLoading, setIsLoading] = useState(false);
  
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
    setIsLoading(true);
    // Simulate loading time for large media
    setTimeout(() => {
      setMediaItems(prev => [...prev, newMedia]);
      setSelectedMediaId(newMedia.id);
      setShowUploadDialog(false);
      setIsLoading(false);
    }, 500);
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
  
  // Handle canvas size change
  const handleCanvasSizeChange = (size) => {
    setCanvasSize(size);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Box style={{ textAlign: 'center' }}>
          <Loader size="lg" color="blue" />
          <Text mt="md">Processing your media...</Text>
        </Box>
      </Center>
    );
  }
  
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
          <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Start by adding media to your project</h1>
          <p style={{ marginBottom: '24px', color: '#666' }}>Upload images or videos to begin editing</p>
          <Button 
            size="lg" 
            radius="xl"
            onClick={() => setShowUploadDialog(true)}
            sx={(theme) => ({
              background: theme.fn.linearGradient(45, '#3b82f6', '#2563eb'),
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
                transform: 'translateY(-1px)'
              }
            })}
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
          onCanvasSizeChange={handleCanvasSizeChange}
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
