'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Group, ActionIcon, Text } from '@mantine/core';
import { FiPlay, FiPause, FiSkipBack } from 'react-icons/fi';

const TIMELINE_DURATION = 60; // 60 seconds total timeline
const TIMELINE_WIDTH = 1000; // px

const Timeline = ({ 
  mediaItems, 
  isPlaying, 
  currentTime, 
  onPlayPause, 
  onTimeUpdate,
  onSelectMedia,
  selectedMediaId
}) => {
  const timelineRef = useRef(null);
  const [isDraggingMarker, setIsDraggingMarker] = useState(false);
  const [timeMarkersCount, setTimeMarkersCount] = useState(12); // Number of time markers
  
  // Update marker position when playing
  useEffect(() => {
    const markerPosition = (currentTime / TIMELINE_DURATION) * TIMELINE_WIDTH;
    if (timelineRef.current) {
      const marker = timelineRef.current.querySelector('.timeline-marker');
      if (marker) {
        marker.style.left = `${markerPosition}px`;
      }
    }
  }, [currentTime]);
  
  // Handle click on timeline to update current time
  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = Math.max(0, Math.min(TIMELINE_DURATION, percentage * TIMELINE_DURATION));
    
    onTimeUpdate(parseFloat(newTime.toFixed(1)));
  };
  
  // Handle dragging the time marker
  const handleMarkerMouseDown = (e) => {
    e.stopPropagation();
    setIsDraggingMarker(true);
    
    const handleMouseMove = (moveEvent) => {
      if (isDraggingMarker && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = moveEvent.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * TIMELINE_DURATION;
        
        onTimeUpdate(parseFloat(newTime.toFixed(1)));
      }
    };
    
    const handleMouseUp = () => {
      setIsDraggingMarker(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Reset timer to beginning
  const handleReset = () => {
    onTimeUpdate(0);
    if (isPlaying) {
      onPlayPause(false);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Generate time markers
  const renderTimeMarkers = () => {
    const markers = [];
    const interval = TIMELINE_DURATION / timeMarkersCount;
    
    for (let i = 0; i <= timeMarkersCount; i++) {
      const timeVal = i * interval;
      const position = (timeVal / TIMELINE_DURATION) * 100;
      
      markers.push(
        <div 
          key={i} 
          style={{ 
            position: 'absolute', 
            left: `${position}%`, 
            height: '100%', 
            width: '1px', 
            backgroundColor: '#ddd',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
          }}
        >
          <span style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
            {formatTime(timeVal)}
          </span>
        </div>
      );
    }
    
    return markers;
  };
  
  // Render media items in timeline
  const renderMediaItems = () => {
    return mediaItems.map((media) => {
      const startPosition = (media.startTime / TIMELINE_DURATION) * 100;
      const duration = media.endTime - media.startTime;
      const width = (duration / TIMELINE_DURATION) * 100;
      const isSelected = media.id === selectedMediaId;
      
      return (
        <div
          key={media.id}
          className={`timeline-item ${isSelected ? 'selected' : ''}`}
          style={{
            left: `${startPosition}%`,
            width: `${width}%`,
            backgroundColor: isSelected ? '#2684ff' : '#3c81f6',
            border: isSelected ? '2px solid #0056d6' : 'none',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectMedia(media.id);
          }}
        >
          {media.type === 'image' ? 'Image' : 'Video'}
        </div>
      );
    });
  };
  
  return (
    <div className="timeline">
      <Group position="apart" p="xs">
        <Group>
          <ActionIcon size="md" onClick={handleReset}>
            <FiSkipBack />
          </ActionIcon>
          <ActionIcon size="md" onClick={() => onPlayPause(!isPlaying)}>
            {isPlaying ? <FiPause /> : <FiPlay />}
          </ActionIcon>
          <Text size="sm">{formatTime(currentTime)} / {formatTime(TIMELINE_DURATION)}</Text>
        </Group>
      </Group>
      
      <div 
        className="timeline-ruler" 
        ref={timelineRef} 
        onClick={handleTimelineClick}
        style={{ width: `${TIMELINE_WIDTH}px`, overflow: 'hidden' }}
      >
        {renderTimeMarkers()}
        <div 
          className="timeline-marker" 
          style={{ left: 0 }}
          onMouseDown={handleMarkerMouseDown}
        />
      </div>
      
      <div 
        className="timeline-items" 
        style={{ width: `${TIMELINE_WIDTH}px` }}
        onClick={handleTimelineClick}
      >
        {renderMediaItems()}
      </div>
    </div>
  );
};

export default Timeline; 