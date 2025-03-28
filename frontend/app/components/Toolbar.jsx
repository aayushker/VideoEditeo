'use client';

import { Group, Text, Button, TextInput, ActionIcon, Select } from '@mantine/core';
import { FiSave, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Toolbar = ({ projectName, setProjectName }) => {
  return (
    <div className="toolbar">
      <Group>
        <Text fw={600} size="md">
          {projectName || 'Project Name'}
        </Text>
        <TextInput
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          size="xs"
          style={{ width: 200 }}
        />
      </Group>

      <Group>
        <ActionIcon variant="transparent">
          <FiChevronLeft size={18} />
        </ActionIcon>
        <ActionIcon variant="transparent">
          <FiChevronRight size={18} />
        </ActionIcon>
      </Group>

      <Group>
        <Text size="sm" color="dimmed">
          Save your project for later —
        </Text>
        <Button variant="outline" size="xs" leftIcon={<FiSave size={14} />}>
          Sign up
        </Button>
        <Text size="sm">or</Text>
        <Button variant="link" size="xs">
          Log in
        </Button>
        <Button 
          variant="filled" 
          size="sm" 
          leftIcon={<FiDownload size={14} />} 
          color="blue"
        >
          Done
        </Button>
      </Group>
    </div>
  );
};

export default Toolbar; 