'use client';

import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Box } from '@mantine/core';

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
  const [position, setPosition] = useState({ x: media.position.x, y: media.position.y });
  const [size, setSize] = useState({ width: media.width, height: media.height });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the media should be visible based on start and end time
    if (isPlaying) {
      const shouldBeVisible = 
        currentTime >= media.startTime && 
        currentTime <= media.endTime;
      setVisible(shouldBeVisible);
    } else {
      // Always visible when not playing
      setVisible(true);
    }
  }, [isPlaying, currentTime, media.startTime, media.endTime]);

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
        />
      );
    } else if (media.type === 'video') {
      return (
        <video 
          src={media.src}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          controls={false}
        />
      );
    }
    return null;
  };

  if (!visible) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div ref={nodeRef} style={{ position: 'absolute' }} onClick={() => onSelect(media.id)}>
        <ResizableBox
          width={size.width}
          height={size.height}
          onResize={handleResize}
          minConstraints={[50, 50]}
          maxConstraints={[1000, 1000]}
          className={`resizable-element ${selected ? 'selected' : ''}`}
          resizeHandles={['se', 'sw', 'ne', 'nw']}
          handle={(h, ref) => (
            <span 
              className="resize-handle" 
              style={{
                bottom: h === 'se' || h === 'sw' ? -4 : 'auto',
                top: h === 'ne' || h === 'nw' ? -4 : 'auto',
                left: h === 'sw' || h === 'nw' ? -4 : 'auto',
                right: h === 'se' || h === 'ne' ? -4 : 'auto',
              }}
            />
          )}
        >
          <Box style={{ width: '100%', height: '100%' }}>
            {renderContent()}
          </Box>
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default MediaElement; 