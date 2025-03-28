# VideoEditeo

A clean, intuitive video editor web application inspired by veed.io. Built with Next.js and Mantine UI components.

## Features

1. **Media Upload**: Add images and videos to the canvas
2. **Drag and Resize**: Move and resize media elements freely
3. **Width/Height Controls**: Adjust dimensions precisely with input controls
4. **Timing Controls**: Set start and end times for each media element
5. **Timeline Playback**: See your media appear and disappear based on timing settings

## Getting Started

### Prerequisites

- Node.js 14.0 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aayushker/VideoEditeo.git
cd VideoEditeo
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

1. **Adding Media**:
   - Click "Upload Media" or drag and drop files into the upload area
   - Supported formats: Images (JPG, PNG, GIF) and Videos (MP4, WebM)

2. **Editing Media**:
   - Click on a media element to select it
   - Drag it to reposition on the canvas
   - Resize by dragging the corner handles
   - Use the sidebar controls to set precise dimensions and timing

3. **Timeline Controls**:
   - Play/Pause: Control playback
   - Timeline scrubbing: Click or drag along the timeline to set the current time
   - Media will appear and disappear based on their start and end times

## Project Structure

```
/app
  /components
    Canvas.jsx         # Main editing canvas
    MediaElement.jsx   # Draggable/resizable media component
    Sidebar.jsx        # Left side panel with controls
    Timeline.jsx       # Timeline for playback control
    Toolbar.jsx        # Top toolbar
    UploadDialog.jsx   # Media upload modal
  globals.css          # Global styles
  layout.js            # App layout with Mantine provider
  page.js              # Main application page
```

## Technologies Used

- **Next.js**: React framework for SSR and routing
- **Mantine UI**: Component library for consistent design
- **React-Draggable**: For draggable media elements
- **React-Resizable**: For resizable media elements

## License

MIT License
