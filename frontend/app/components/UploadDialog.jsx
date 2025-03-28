'use client';

import { useState, useRef } from 'react';
import { 
  Modal, 
  Text, 
  Button, 
  Group, 
  Box, 
  useMantineTheme 
} from '@mantine/core';
import { FiUpload, FiVideo, FiImage } from 'react-icons/fi';

const UploadDialog = ({ opened, onClose, onUpload }) => {
  const theme = useMantineTheme();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file) => {
    if (!file) return;
    
    const fileType = file.type.startsWith('image') ? 'image' : 'video';
    const fileUrl = URL.createObjectURL(file);
    
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
    
    onUpload(newMedia);
    onClose();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Let's make a video!" 
      centered
      size="lg"
    >
      <Box 
        sx={{
          border: `2px dashed ${dragOver ? theme.colors.blue[5] : theme.colors.gray[3]}`,
          borderRadius: theme.radius.md,
          padding: 50,
          textAlign: 'center',
          marginBottom: 20,
          backgroundColor: dragOver ? theme.colors.blue[0] : theme.colors.gray[0],
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FiUpload size={48} style={{ margin: '0 auto', display: 'block', marginBottom: 10, color: theme.colors.blue[5] }} />
        <Text size="xl" weight={500} mb="xs">Upload files</Text>
        <Text size="sm" color="dimmed" mb="sm">Choose files or drag them here</Text>
        <Button variant="outline" leftIcon={<FiUpload size={14} />} onClick={() => fileInputRef.current.click()}>
          Choose files
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileInputChange}
          accept="image/*,video/*"
        />
      </Box>

      <Group position="center" grow>
        <Button 
          leftIcon={<FiVideo />} 
          variant="light"
          onClick={() => {}}
        >
          Start by recording
        </Button>
        <Button 
          leftIcon={<FiImage />} 
          variant="light"
          onClick={() => {}}
        >
          Start with AI
        </Button>
      </Group>
    </Modal>
  );
};

export default UploadDialog; 