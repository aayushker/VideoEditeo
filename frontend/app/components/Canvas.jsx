'use client';

import { useRef, useState } from 'react';
import { Box, Group, ActionIcon, Text, Select, Tooltip } from '@mantine/core';
import { FiMaximize, FiGrid, FiZoomIn, FiZoomOut, FiCheck, FiLock, FiUnlock } from 'react-icons/fi';
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
  onCanvasSizeChange,
}) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [locked, setLocked] = useState(false);

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

  const handleCanvasSizeChange = (value) => {
    const [width, height] = value.split(':').map(Number);
    if (onCanvasSizeChange && width && height) {
      onCanvasSizeChange({ width, height });
    }
  };

  return (
    <div className="canvas-container">
      <div
        ref={canvasRef}
        className={`canvas ${showGrid ? 'with-grid' : ''}`}
        onClick={handleCanvasClick}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          transform: `scale(${zoom})`,
          transition: 'transform 0.2s ease',
          backgroundImage: showGrid ? 
            `linear-gradient(to right, rgba(50, 50, 50, 0.05) 1px, transparent 1px), 
             linear-gradient(to bottom, rgba(50, 50, 50, 0.05) 1px, transparent 1px)` : 
            'none',
          backgroundSize: showGrid ? '20px 20px' : '0',
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

      {/* Zoom controls */}
      <Box
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 12px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Tooltip label="Zoom out" position="top" withArrow>
          <ActionIcon 
            onClick={handleZoomOut} 
            disabled={zoom <= 0.5}
            color="blue"
            variant="subtle"
            size="md"
            radius="xl"
          >
            <FiZoomOut />
          </ActionIcon>
        </Tooltip>
        <Text size="sm" style={{ width: 50, textAlign: 'center', fontWeight: 500, lineHeight: '30px' }}>
          {Math.round(zoom * 100)}%
        </Text>
        <Tooltip label="Zoom in" position="top" withArrow>
          <ActionIcon 
            onClick={handleZoomIn} 
            disabled={zoom >= 2}
            color="blue"
            variant="subtle"
            size="md"
            radius="xl"
          >
            <FiZoomIn />
          </ActionIcon>
        </Tooltip>
      </Box>

      {/* Canvas controls */}
      <Box
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 12px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Tooltip label="Canvas size" position="left" withArrow>
          <Select
            size="xs"
            value={`${canvasSize.width}:${canvasSize.height}`}
            onChange={handleCanvasSizeChange}
            data={[
              { value: '1920:1080', label: 'Landscape (16:9)' },
              { value: '1080:1920', label: 'Portrait (9:16)' },
              { value: '1080:1080', label: 'Square (1:1)' },
              { value: '640:360', label: 'Small (16:9)' },
            ]}
            styles={{
              root: { width: 150 }
            }}
            rightSection={<FiCheck size={14} />}
          />
        </Tooltip>
        <Group spacing={5}>
          <Tooltip label="Toggle grid" position="left" withArrow>
            <ActionIcon 
              variant={showGrid ? "filled" : "subtle"} 
              color={showGrid ? "blue" : "gray"}
              onClick={() => setShowGrid(!showGrid)}
            >
              <FiGrid />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Toggle fullscreen (under development)" position="left" withArrow>
            <ActionIcon 
              variant="subtle"
              color="gray"
            >
              <FiMaximize />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={locked ? "Unlock canvas" : "Lock canvas (under development)"} position="left" withArrow>
            <ActionIcon 
              variant="subtle"
              color="gray"
              onClick={() => setLocked(!locked)}
            >
              {locked ? <FiLock /> : <FiUnlock />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>
    </div>
  );
};

export default Canvas; 