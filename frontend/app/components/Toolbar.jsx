'use client';

import { Group, Text, Button, TextInput, ActionIcon, Select, Tooltip, Avatar, Menu, Divider } from '@mantine/core';
import { FiSave, FiDownload, FiChevronLeft, FiChevronRight, FiUser, FiMenu, FiMoreVertical, FiEdit, FiClock } from 'react-icons/fi';

const Toolbar = ({ projectName, setProjectName }) => {
  return (
    <div className="toolbar">
      <Group>
        <ActionIcon 
          variant="subtle" 
          color="gray" 
          radius="xl" 
          size="lg"
          className="menu-button"
        >
          <FiMenu size={18} />
        </ActionIcon>
        <div className="project-title">
          <Group spacing={8}>
            <Text fw={700} size="md" className="gradient-text">
              {projectName || 'Project Name'}
            </Text>
            <Tooltip label="Edit project name">
              <ActionIcon variant="subtle" size="sm" className="edit-icon">
                <FiEdit size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Group spacing={6}>
            <FiClock size={12} style={{ color: '#adb5bd' }} />
            <Text size="xs" color="dimmed">Auto-saved 2 minutes ago</Text>
          </Group>
        </div>
      </Group>

      <Group className="history-controls">
        <Tooltip label="Undo" position="bottom" withArrow>
          <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
            <FiChevronLeft size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Redo" position="bottom" withArrow>
          <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
            <FiChevronRight size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Group>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Button
              variant="subtle"
              size="sm"
              rightIcon={<FiMoreVertical size={14} />}
              color="gray"
            >
              Options
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Project</Menu.Label>
            <Menu.Item icon={<FiEdit size={14} />}>Rename</Menu.Item>
            <Menu.Item icon={<FiSave size={14} />}>Save as template</Menu.Item>
            <Divider />
            <Menu.Label>Account</Menu.Label>
            <Menu.Item icon={<FiUser size={14} />}>Log in</Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <TextInput
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          size="xs"
          radius="xl"
          icon={<FiEdit size={14} />}
          styles={(theme) => ({
            root: { width: '200px' },
            input: { 
              background: '#f5f5f5',
              borderColor: theme.colors.gray[3],
              '&:focus': {
                borderColor: theme.colors.blue[5]
              }
            }
          })}
        />
        
        <Tooltip label="Sign up to save your work" position="bottom" withArrow>
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<FiSave size={14} />}
            radius="xl"
            color="indigo"
            className="signup-button"
          >
            Sign up
          </Button>
        </Tooltip>
        
        <Tooltip label="Export your project" position="bottom" withArrow>
          <Button 
            variant="gradient" 
            gradient={{ from: '#3b82f6', to: '#2563eb', deg: 45 }}
            size="sm" 
            leftIcon={<FiDownload size={14} />} 
            radius="xl"
            className="export-button"
          >
            Export
          </Button>
        </Tooltip>
      </Group>
    </div>
  );
};

export default Toolbar; 