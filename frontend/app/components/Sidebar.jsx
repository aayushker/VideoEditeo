'use client';

import { useState } from 'react';
import { 
  Box, 
  Text, 
  NumberInput, 
  Stack, 
  Group, 
  Button, 
  Divider,
  Switch,
  FileInput
} from '@mantine/core';
import { 
  FiUpload, 
  FiSearch, 
  FiSettings, 
  FiPackage, 
  FiFile, 
  FiMusic, 
  FiType, 
  FiLayers 
} from 'react-icons/fi';

const Sidebar = ({ 
  selectedMedia, 
  onMediaUpdate, 
  onMediaUpload 
}) => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (uploadedFile) => {
    if (!uploadedFile) return;

    setFile(uploadedFile);
    
    const fileType = uploadedFile.type.startsWith('image') ? 'image' : 'video';
    const fileUrl = URL.createObjectURL(uploadedFile);
    
    const newMedia = {
      id: Date.now().toString(),
      type: fileType,
      src: fileUrl,
      width: 320,
      height: 240,
      position: { x: 100, y: 100 },
      startTime: 0,
      endTime: fileType === 'video' ? 10 : 5, // Default end time
    };
    
    onMediaUpload(newMedia);
  };

  const handleWidthChange = (value) => {
    if (selectedMedia) {
      onMediaUpdate(selectedMedia.id, {
        ...selectedMedia,
        width: value
      });
    }
  };

  const handleHeightChange = (value) => {
    if (selectedMedia) {
      onMediaUpdate(selectedMedia.id, {
        ...selectedMedia,
        height: value
      });
    }
  };

  const handleStartTimeChange = (value) => {
    if (selectedMedia) {
      onMediaUpdate(selectedMedia.id, {
        ...selectedMedia,
        startTime: value
      });
    }
  };

  const handleEndTimeChange = (value) => {
    if (selectedMedia) {
      onMediaUpdate(selectedMedia.id, {
        ...selectedMedia,
        endTime: value
      });
    }
  };

  // Render sidebar icons for left sidebar
  const renderSidebarIcons = () => (
    <Stack spacing="lg" align="center" py="md">
      <FiSearch size={20} />
      <FiSettings size={20} />
      <FiPackage size={20} />
      <FiFile size={20} />
      <FiMusic size={20} />
      <FiType size={20} />
      <FiLayers size={20} />
    </Stack>
  );

  // Render media properties when a media is selected
  const renderMediaProperties = () => {
    if (!selectedMedia) return null;

    return (
      <Box p="md">
        <Text fw={500} mb="md">{selectedMedia.type === 'image' ? 'Image Properties' : 'Video Properties'}</Text>
        
        <Divider mb="md" />
        
        <Text size="sm" mb="xs">Dimensions</Text>
        <Group grow mb="md">
          <NumberInput
            label="Width"
            value={selectedMedia.width}
            onChange={handleWidthChange}
            min={50}
            max={1920}
            step={1}
          />
          <NumberInput
            label="Height"
            value={selectedMedia.height}
            onChange={handleHeightChange}
            min={50}
            max={1080}
            step={1}
          />
        </Group>
        
        <Divider mb="md" />
        
        <Text size="sm" mb="xs">Timing</Text>
        <Group grow mb="md">
          <NumberInput
            label="Start Time (s)"
            value={selectedMedia.startTime}
            onChange={handleStartTimeChange}
            min={0}
            max={60}
            step={0.1}
            precision={1}
          />
          <NumberInput
            label="End Time (s)"
            value={selectedMedia.endTime}
            onChange={handleEndTimeChange}
            min={selectedMedia.startTime + 0.1}
            max={60}
            step={0.1}
            precision={1}
          />
        </Group>

        {selectedMedia.type === 'video' && (
          <>
            <Divider mb="md" />
            <Group position="apart" mb="xs">
              <Text size="sm">Mute</Text>
              <Switch size="md" />
            </Group>
          </>
        )}
      </Box>
    );
  };

  // Render upload section when no media is selected
  const renderUploadSection = () => {
    if (selectedMedia) return null;

    return (
      <Box p="md">
        <Text fw={500} mb="md">Media</Text>
        <FileInput
          placeholder="Upload media file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          icon={<FiUpload size={14} />}
          mb="md"
        />
        <Box className="upload-zone" onClick={() => document.querySelector('input[type="file"]').click()}>
          <FiUpload size={24} style={{ margin: '0 auto', display: 'block', marginBottom: '10px' }} />
          <Text>Drop files here or click to upload</Text>
          <Text size="xs" color="dimmed" mt="xs">Supports images and videos</Text>
        </Box>
      </Box>
    );
  };

  return (
    <div className="sidebar">
      {renderSidebarIcons()}
      <Divider />
      {renderMediaProperties() || renderUploadSection()}
    </div>
  );
};

export default Sidebar; 