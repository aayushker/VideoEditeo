'use client';

import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Box, Tooltip } from '@mantine/core';
import { FiMaximize, FiCopy, FiTrash2, FiMove } from 'react-icons/fi';

const MediaElement = ({ 
  media, 
  isPlaying, 
  currentTime, 
  onPositionChange, 
  onSizeChange,
  selected,
  onSelect
}) => {
  const nodeRef = useRef(null);
  const videoRef = useRef(null);
  const [position, setPosition] = useState({ x: media.position.x, y: media.position.y });
  const [size, setSize] = useState({ width: media.width, height: media.height });
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Update local state when media props change (for sidebar dimension updates)
  useEffect(() => {
    setSize({ width: media.width, height: media.height });
  }, [media.width, media.height]);

  // Update position when media position changes
  useEffect(() => {
    setPosition({ x: media.position.x, y: media.position.y });
  }, [media.position.x, media.position.y]);

  useEffect(() => {
    // Check if the media should be visible based on start and end time
    if (isPlaying) {
      const shouldBeVisible = 
        currentTime >= media.startTime && 
        currentTime <= media.endTime;
      setVisible(shouldBeVisible);
      
      // If it's a video and should be playing
      if (media.type === 'video' && shouldBeVisible && videoRef.current) {
        // Set current time for video if needed
        if (Math.abs(videoRef.current.currentTime - (currentTime - media.startTime)) > 0.5) {
          videoRef.current.currentTime = currentTime - media.startTime;
        }
        
        // Play the video if it's paused
        if (videoRef.current.paused) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Video play error:", error);
            });
          }
        }
      } else if (media.type === 'video' && videoRef.current && !videoRef.current.paused) {
        // Pause the video if it shouldn't be visible
        videoRef.current.pause();
      }
    } else {
      // Always visible when not playing
      setVisible(true);
      
      // Pause video when not playing
      if (media.type === 'video' && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentTime, media.startTime, media.endTime, media.type]);

  const handleDragStop = (e, data) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    onPositionChange(media.id, newPosition);
  };

  const handleResize = (e, { size }) => {
    setSize({ width: size.width, height: size.height });
    onSizeChange(media.id, size.width, size.height);
  };

  // Conditionally render content based on media type
  const renderContent = () => {
    if (media.type === 'image') {
      return (
        <img 
          src={media.src} 
          alt="Media element" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          draggable={false}
        />
      );
    } else if (media.type === 'video') {
      return (
        <video 
          ref={videoRef}
          src={media.src}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          controls={false}
          muted={true}
          loop={true}
          draggable={false}
        />
      );
    }
    return null;
  };

  if (!visible) return null;

  // Controls that appear when element is selected
  const renderControls = () => {
    if (!selected && !hovered) return null;
    
    return (
      <div className="media-controls" style={{ 
        position: 'absolute', 
        top: '-30px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '15px',
        padding: '4px 8px',
        display: 'flex',
        gap: '5px',
        zIndex: 100
      }}>
        <Tooltip label="Duplicate" withArrow position="top">
          <div style={{ 
            cursor: 'pointer', 
            color: 'white', 
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiCopy size={14} />
          </div>
        </Tooltip>
        
        <Tooltip label="Delete" withArrow position="top">
          <div style={{ 
            cursor: 'pointer', 
            color: 'white', 
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiTrash2 size={14} />
          </div>
        </Tooltip>
        
        <Tooltip label="Fit to screen" withArrow position="top">
          <div style={{ 
            cursor: 'pointer', 
            color: 'white', 
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiMaximize size={14} />
          </div>
        </Tooltip>
      </div>
    );
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={handleDragStop}
      bounds="parent"
      handle=".drag-handle"
    >
      <div 
        ref={nodeRef} 
        style={{ position: 'absolute' }} 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(media.id);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`media-element ${selected ? 'selected' : ''}`}
      >
        {renderControls()}
        <ResizableBox
          width={size.width}
          height={size.height}
          onResize={handleResize}
          minConstraints={[50, 50]}
          maxConstraints={[1000, 1000]}
          className={`resizable-element ${selected ? 'selected' : ''}`}
          resizeHandles={['se', 'sw', 'ne', 'nw']}
        >
          <Box style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative', 
            overflow: 'hidden',
            border: selected ? '1px solid rgba(60, 129, 246, 0.5)' : 'none'
          }}>
            {renderContent()}
            
            {/* Drag handle that appears when hovered or selected */}
            <div 
              className="drag-handle" 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'move',
                display: (selected || hovered) ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.03)',
                zIndex: 5
              }}
            >
              {(selected || hovered) && (
                <FiMove 
                  size={24} 
                  style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    opacity: 0.7,
                    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                  }} 
                />
              )}
            </div>
          </Box>
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default MediaElement; 