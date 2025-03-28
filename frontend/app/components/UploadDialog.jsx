'use client';

import { useState, useRef } from 'react';
import { 
  Modal, 
  Text, 
  Button, 
  Group, 
  Box, 
  useMantineTheme,
  Tooltip,
  Stack
} from '@mantine/core';
import { FiUpload, FiVideo, FiImage, FiInfo } from 'react-icons/fi';

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
  
  // Prevent the default click behavior that might trigger multiple file dialogs
  const handleBoxClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current.click();
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={
        <Text fw={700} size="xl" className="gradient-text" style={{ marginBottom: '8px' }}>
          Let's make a video!
        </Text>
      }
      centered
      size="lg"
      radius="md"
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      styles={{
        header: {
          marginBottom: '10px'
        },
        content: {
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box 
        sx={(theme) => ({
          border: `2px dashed ${dragOver ? theme.colors.blue[5] : theme.colors.gray[3]}`,
          borderRadius: theme.radius.md,
          padding: 50,
          textAlign: 'center',
          marginBottom: 20,
          backgroundColor: dragOver ? theme.colors.blue[0] : theme.colors.gray[0],
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          backgroundImage: dragOver ? 
            'linear-gradient(to bottom, #e6f0ff, #f0f7ff)' : 
            'linear-gradient(to bottom, #f8f9fa, #f0f2f5)',
        })}
        onClick={(e) => {
          // Make the entire box clickable for better UX
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FiUpload size={48} style={{ margin: '0 auto', display: 'block', marginBottom: 10, color: theme.colors.blue[5] }} />
        <Text size="xl" weight={600} mb="xs">Upload files</Text>
        <Text size="sm" color="dimmed" mb="sm">Choose files or drag them here</Text>
        <Button 
          variant="filled" 
          color="blue" 
          leftIcon={<FiUpload size={14} />} 
          onClick={(e) => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          radius="xl"
          sx={{ boxShadow: '0 4px 8px rgba(59, 130, 246, 0.2)' }}
        >
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
        <Tooltip label="Under development" withArrow>
          <Button 
            leftIcon={<FiVideo />} 
            variant="light"
            color="blue"
            radius="md"
            disabled
          >
            Start by recording
          </Button>
        </Tooltip>
        <Tooltip label="Under development" withArrow>
          <Button 
            leftIcon={<FiImage />} 
            variant="light"
            color="indigo"
            radius="md"
            disabled
          >
            Start with AI
          </Button>
        </Tooltip>
      </Group>
      
      <Box 
        sx={{ 
          marginTop: 20, 
          padding: 15, 
          backgroundColor: theme.colors.gray[0], 
          borderRadius: theme.radius.md,
          borderLeft: `4px solid ${theme.colors.blue[3]}`
        }}
      >
        <Group spacing="sm">
          <FiInfo size={18} style={{ color: theme.colors.blue[5] }} />
          <Stack spacing={0}>
            <Text size="sm" fw={500}>Pro tip</Text>
            <Text size="xs" color="dimmed">
              Upload videos and images to create your project. You can then drag, resize, and set timing for each element.
            </Text>
          </Stack>
        </Group>
      </Box>
    </Modal>
  );
};

export default UploadDialog; 