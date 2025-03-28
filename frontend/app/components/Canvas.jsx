'use client';

import { useRef, useState } from 'react';
import { Box, Group, ActionIcon, Text, Select } from '@mantine/core';
import { FiMaximize, FiGrid, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import MediaElement from './MediaElement';

const Canvas = ({
  mediaItems,
  isPlaying,
  currentTime,
  onPositionChange,
  onSizeChange,
  selectedMediaId,
  onSelectMedia,
  canvasSize,
}) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  const handleCanvasClick = (e) => {
    // Deselect when clicking on empty canvas
    if (e.target === canvasRef.current) {
      onSelectMedia(null);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="canvas-container">
      <div
        ref={canvasRef}
        className="canvas"
        onClick={handleCanvasClick}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          transform: `scale(${zoom})`,
          transition: 'transform 0.2s ease',
        }}
      >
        {mediaItems.map((media) => (
          <MediaElement
            key={media.id}
            media={media}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onPositionChange={onPositionChange}
            onSizeChange={onSizeChange}
            selected={media.id === selectedMediaId}
            onSelect={onSelectMedia}
          />
        ))}
      </div>

      <Box
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '5px 10px',
          borderRadius: 4,
        }}
      >
        <ActionIcon onClick={handleZoomOut} disabled={zoom <= 0.5}>
          <FiZoomOut />
        </ActionIcon>
        <Text size="sm" style={{ width: 50, textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </Text>
        <ActionIcon onClick={handleZoomIn} disabled={zoom >= 2}>
          <FiZoomIn />
        </ActionIcon>
      </Box>

      <Box
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Select
          size="xs"
          value={`${canvasSize.width}:${canvasSize.height}`}
          data={[
            { value: '1920:1080', label: 'Landscape (16:9)' },
            { value: '1080:1920', label: 'Portrait (9:16)' },
            { value: '1080:1080', label: 'Square (1:1)' },
          ]}
          style={{ width: 150 }}
          readOnly
        />
        <Group spacing={5}>
          <ActionIcon variant="subtle">
            <FiGrid />
          </ActionIcon>
          <ActionIcon variant="subtle">
            <FiMaximize />
          </ActionIcon>
        </Group>
      </Box>
    </div>
  );
};

export default Canvas; 