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
  FileInput,
  Tooltip,
  ThemeIcon
} from '@mantine/core';
import { 
  FiUpload, 
  FiSearch, 
  FiSettings, 
  FiPackage, 
  FiFile, 
  FiMusic, 
  FiType, 
  FiLayers,
  FiVideo,
  FiImage
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
    
    // Reset file state after a short delay to allow for new uploads
    setTimeout(() => {
      setFile(null);
    }, 1000);
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

  // Render sidebar icons for left sidebar with labels
  const renderSidebarIcons = () => (
    <Box p="md">
      <Stack spacing="md">
        <Tooltip label="Search" position="right" withArrow>
          <Group spacing="md" className="sidebar-menu-item">
            <ThemeIcon variant="light" color="blue" size="md" radius="md">
              <FiSearch size={16} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Search</Text>
          </Group>
        </Tooltip>
        
        <Tooltip label="Settings" position="right" withArrow>
          <Group spacing="md" className="sidebar-menu-item">
            <ThemeIcon variant="light" color="blue" size="md" radius="md">
              <FiSettings size={16} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Settings</Text>
          </Group>
        </Tooltip>

        <Tooltip label="Brand Kits" position="right" withArrow>
          <Group spacing="md" className="sidebar-menu-item">
            <ThemeIcon variant="light" color="blue" size="md" radius="md">
              <FiPackage size={16} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Brand Kits</Text>
          </Group>
        </Tooltip>

        <Tooltip label="Media" position="right" withArrow>
          <Group spacing="md" className="sidebar-menu-item active">
            <ThemeIcon variant="filled" color="blue" size="md" radius="md">
              <FiFile size={16} />
            </ThemeIcon>
            <Text size="sm" fw={600}>Media</Text>
          </Group>
        </Tooltip>

        <Tooltip label="Audio" position="right" withArrow>
          <Group spacing="md" className="sidebar-menu-item">
            <ThemeIcon variant="light" color="blue" size="md" radius="md">
              <FiMusic size={16} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Audio</Text>
          </Group>
        </Tooltip>

        <Tooltip label="Text" position="right" withArrow>
          <Group spacing="md" className="sidebar-menu-item">
            <ThemeIcon variant="light" color="blue" size="md" radius="md">
              <FiType size={16} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Text</Text>
          </Group>
        </Tooltip>

        <Tooltip label="Elements" position="right" withArrow>
          <Group spacing="md" className="sidebar-menu-item">
            <ThemeIcon variant="light" color="blue" size="md" radius="md">
              <FiLayers size={16} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Elements</Text>
          </Group>
        </Tooltip>
      </Stack>
    </Box>
  );

  // Render media properties when a media is selected
  const renderMediaProperties = () => {
    if (!selectedMedia) return null;

    return (
      <Box p="md" className="sidebar-properties">
        <Text fw={700} size="md" mb="md" className="sidebar-title">
          {selectedMedia.type === 'image' ? 'Image Properties' : 'Video Properties'}
        </Text>
        
        <Divider mb="md" />
        
        <Text size="sm" fw={600} mb="xs" color="dark">Dimensions</Text>
        <Group grow mb="md">
          <NumberInput
            label="Width"
            value={selectedMedia.width}
            onChange={handleWidthChange}
            min={50}
            max={1920}
            step={1}
            styles={{ 
              label: { 
                color: '#444',
                fontWeight: 500
              },
              input: { 
                background: '#f5f5f5',
                borderColor: '#d0d0d0',
                color: '#333',
                fontWeight: 500
              } 
            }}
          />
          <NumberInput
            label="Height"
            value={selectedMedia.height}
            onChange={handleHeightChange}
            min={50}
            max={1080}
            step={1}
            styles={{ 
              label: { 
                color: '#444',
                fontWeight: 500
              },
              input: { 
                background: '#f5f5f5',
                borderColor: '#d0d0d0',
                color: '#333',
                fontWeight: 500
              } 
            }}
          />
        </Group>
        
        <Divider mb="md" />
        
        <Text size="sm" fw={600} mb="xs" color="dark">Timing</Text>
        <Group grow mb="md">
          <NumberInput
            label="Start Time (s)"
            value={selectedMedia.startTime}
            onChange={handleStartTimeChange}
            min={0}
            max={60}
            step={0.1}
            precision={1}
            styles={{ 
              label: { 
                color: '#444',
                fontWeight: 500
              },
              input: { 
                background: '#f5f5f5',
                borderColor: '#d0d0d0',
                color: '#333',
                fontWeight: 500
              } 
            }}
          />
          <NumberInput
            label="End Time (s)"
            value={selectedMedia.endTime}
            onChange={handleEndTimeChange}
            min={selectedMedia.startTime + 0.1}
            max={60}
            step={0.1}
            precision={1}
            styles={{ 
              label: { 
                color: '#444',
                fontWeight: 500
              },
              input: { 
                background: '#f5f5f5',
                borderColor: '#d0d0d0',
                color: '#333',
                fontWeight: 500
              } 
            }}
          />
        </Group>

        {selectedMedia.type === 'video' && (
          <>
            <Divider mb="md" />
            <Group position="apart" mb="xs">
              <Text size="sm" fw={600} color="dark">Mute</Text>
              <Switch size="md" color="blue" />
            </Group>

            <Divider mb="md" />
            <Text size="sm" fw={600} mb="xs" color="dark">Effects</Text>
            <Group grow>
              <Tooltip label="Under development" position="top" withArrow>
                <Button size="xs" variant="outline" leftIcon={<FiVideo size={14} />}>Trim</Button>
              </Tooltip>
              <Tooltip label="Under development" position="top" withArrow>
                <Button size="xs" variant="outline" leftIcon={<FiImage size={14} />}>Filter</Button>
              </Tooltip>
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
      <Box p="md" className="sidebar-upload">
        <Text fw={700} size="md" mb="md" className="sidebar-title">Media Library</Text>
        <FileInput
          placeholder="Upload media file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          icon={<FiUpload size={14} />}
          mb="md"
          styles={{ 
            input: { 
              background: '#f5f5f5',
              borderColor: '#d0d0d0',
              color: '#333'
            },
            label: {
              color: '#444',
              fontWeight: 500
            },
            description: {
              color: '#555'
            }
          }}
          disabled={file !== null}
          description="Supports images and videos"
          clickable={true}
        />
        <Box 
          className="upload-zone" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelector('input[type="file"]').click();
          }}
          sx={(theme) => ({
            background: 'linear-gradient(to bottom, #f8f9fa, #f0f2f5)',
            borderRadius: theme.radius.md,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
          })}
        >
          <FiUpload size={32} style={{ margin: '0 auto', display: 'block', marginBottom: '15px', color: '#3c81f6' }} />
          <Text fw={600} color="dark">Drop files here</Text>
          <Text size="xs" color="dark" mt="xs">or click to upload</Text>
        </Box>

        <Stack mt="xl" spacing="xs">
          <Text fw={600} mb="xs" size="sm" color="dark">Recent Files</Text>
          <Tooltip label="Under development" position="right" withArrow>
            <Text size="xs" color="dimmed" style={{ fontStyle: 'italic' }}>No recent files found</Text>
          </Tooltip>
        </Stack>
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