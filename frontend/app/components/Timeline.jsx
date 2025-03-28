'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Group, ActionIcon, Text, Tooltip, Slider, Progress } from '@mantine/core';
import { FiPlay, FiPause, FiSkipBack, FiVolume2, FiVolumeX, FiZoomIn, FiZoomOut } from 'react-icons/fi';

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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [zoomLevel, setZoomLevel] = useState(1);
  
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
            backgroundColor: i % 2 === 0 ? '#ccc' : '#ddd',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
          }}
        >
          <span style={{ 
            fontSize: '10px', 
            color: '#666', 
            marginTop: '2px',
            fontWeight: i % 2 === 0 ? 500 : 400,
          }}>
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
            backgroundColor: isSelected ? '#2684ff' : media.type === 'video' ? '#3c81f6' : '#4dabf7',
            border: isSelected ? '2px solid #0056d6' : 'none',
            position: 'absolute',
            height: '70px',
            borderRadius: '4px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            cursor: 'pointer',
            top: '5px',
            overflow: 'hidden',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectMedia(media.id);
          }}
        >
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: '4px',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            <Text size="sm" fw={500}>{media.type === 'image' ? 'Image' : 'Video'}</Text>
            <Text size="xs" color="rgba(255,255,255,0.8)">
              {formatTime(media.startTime)} - {formatTime(media.endTime)}
            </Text>
          </div>
        </div>
      );
    });
  };
  
  // Timeline zoom controls
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));
  };
  
  return (
    <div className="timeline">
      <Group position="apart" p="xs">
        <Group>
          <Tooltip label="Reset" position="top" withArrow>
            <ActionIcon size="md" onClick={handleReset} color="gray" variant="subtle" radius="xl">
              <FiSkipBack />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={isPlaying ? "Pause" : "Play"} position="top" withArrow>
            <ActionIcon 
              size="md" 
              onClick={() => onPlayPause(!isPlaying)} 
              color="blue" 
              variant={isPlaying ? "filled" : "light"}
              radius="xl"
              className="play-button"
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </ActionIcon>
          </Tooltip>
          <Text size="sm" fw={500} style={{ 
            minWidth: '80px', 
            padding: '4px 8px', 
            backgroundColor: '#f0f2f5', 
            borderRadius: '4px' 
          }}>
            {formatTime(currentTime)} / {formatTime(TIMELINE_DURATION)}
          </Text>
        </Group>
        
        <Group>
          <Group position="center" spacing={5}>
            <Tooltip label="Zoom out" position="top" withArrow>
              <ActionIcon 
                size="sm" 
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                variant="subtle"
                color="gray"
              >
                <FiZoomOut size={14} />
              </ActionIcon>
            </Tooltip>
            <Text size="xs" color="dimmed" style={{ width: '30px', textAlign: 'center' }}>
              {Math.round(zoomLevel * 100)}%
            </Text>
            <Tooltip label="Zoom in" position="top" withArrow>
              <ActionIcon 
                size="sm" 
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2}
                variant="subtle"
                color="gray"
              >
                <FiZoomIn size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
          
          <Tooltip label="Volume (under development)" position="top" withArrow>
            <Group spacing={5} noWrap style={{ width: '120px' }}>
              <ActionIcon 
                size="sm" 
                onClick={() => setIsMuted(!isMuted)}
                variant="subtle"
                color="gray"
              >
                {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
              </ActionIcon>
              <Slider
                value={isMuted ? 0 : volume}
                onChange={setVolume}
                size="xs"
                style={{ flex: 1 }}
                color="blue"
                disabled
              />
            </Group>
          </Tooltip>
        </Group>
      </Group>
      
      <div 
        className="timeline-ruler" 
        ref={timelineRef} 
        onClick={handleTimelineClick}
        style={{ 
          width: `${TIMELINE_WIDTH * zoomLevel}px`, 
          overflow: 'hidden',
          position: 'relative',
          height: '20px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {renderTimeMarkers()}
        <div 
          className="timeline-marker" 
          style={{ 
            left: 0,
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '2px',
            backgroundColor: 'var(--primary-color)',
            zIndex: 2,
          }}
          onMouseDown={handleMarkerMouseDown}
        />
      </div>
      
      <div 
        className="timeline-items" 
        style={{ 
          width: `${TIMELINE_WIDTH * zoomLevel}px`,
          display: 'flex',
          position: 'relative',
          height: 'calc(100% - 20px)',
          backgroundColor: '#f8f9fa',
          overflowX: 'hidden',
          borderLeft: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
        }}
        onClick={handleTimelineClick}
      >
        {renderMediaItems()}
      </div>
      
      <Progress 
        value={(currentTime / TIMELINE_DURATION) * 100} 
        size="xs" 
        color="blue" 
        style={{ 
          marginTop: '1px',
          borderRadius: 0 
        }} 
      />
    </div>
  );
};

export default Timeline; 