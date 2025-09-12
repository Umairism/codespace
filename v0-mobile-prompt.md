# v0.app Prompt for WebIDE Mobile Companion App

## Project Description

Create a mobile-responsive web application that serves as a companion to a browser-based IDE. This mobile app should allow users to write, edit, and execute code in JavaScript, Python, and SQL directly from their mobile devices. The app should have an intuitive touch-friendly interface optimized for smartphones and tablets.

## Core Requirements

### 1. **Mobile-First Design**
- Responsive design optimized for mobile screens (320px - 768px)
- Touch-friendly interface with appropriate button sizes (minimum 44px touch targets)
- Swipe gestures for navigation between panels
- Pull-to-refresh functionality
- Bottom navigation for easy thumb access
- Collapsible panels to maximize screen real estate

### 2. **Layout Structure**
- **Header**: App title, project name, and settings icon
- **Bottom Navigation**: Code Editor, File Manager, Console, Run Code
- **Main Content Area**: 
  - Code Editor view (full screen with syntax highlighting)
  - File Manager view (touch-friendly file tree)
  - Console Output view (scrollable terminal-style output)
  - Code Templates view (quick starter code snippets)

### 3. **Code Editor Features**
- Mobile-optimized code input with:
  - Custom keyboard toolbar with programming symbols ( { } [ ] ( ) ; : = + - * / )
  - Syntax highlighting for JavaScript, Python, SQL
  - Line numbers (collapsible on small screens)
  - Auto-indent and bracket matching
  - Find and replace functionality
  - Undo/redo with gesture support
- Code completion dropdown optimized for touch
- Zoom functionality for better readability

### 4. **File Management System**
- Touch-friendly file explorer with large tap targets
- Swipe actions for file operations (swipe left to delete, swipe right for options)
- Long press for context menu (rename, duplicate, share)
- Visual file type indicators with color coding
- Breadcrumb navigation for folder structure
- Quick access to recent files

### 5. **Code Execution Interface**
- Large, prominent "Run Code" button with loading states
- Language selector with visual icons (JS, Python, SQL logos)
- Execution status indicators (running, success, error with colors)
- Console output with:
  - Clear scrollable output area
  - Error highlighting in red
  - Success messages in green
  - Expandable error details

### 6. **Project Management**
- Project switcher with card-based layout
- Create new project from templates:
  - **JavaScript**: React component starter
  - **Python**: Data analysis template
  - **SQL**: Database query examples
- Cloud sync status indicator
- Share project functionality with QR code generation

### 7. **Mobile-Specific Features**
- **Offline Mode**: Cache projects locally for offline coding
- **Quick Actions**: Floating action button for common tasks
- **Code Templates**: Swipeable carousel of code snippets
- **Voice-to-Code**: Voice input for basic code structure (optional)
- **Share Integration**: Share code via messaging apps, email, or social media
- **Dark/Light Theme**: System-based theme switching

### 8. **UI Components & Styling**
- **Design System**: Modern, clean mobile interface
- **Color Scheme**: 
  - Primary: Deep blue (#1e40af)
  - Secondary: Emerald green (#059669) 
  - Background: Dark gray (#1f2937) for dark mode, white for light
  - Accent: Orange (#ea580c) for run buttons and actions
- **Typography**: Clear, readable fonts optimized for mobile
- **Animations**: Smooth transitions and micro-interactions
- **Loading States**: Skeleton screens and progress indicators

### 9. **Navigation & User Experience**
- **Gesture Navigation**: 
  - Swipe left/right between editor tabs
  - Swipe up from bottom to open console
  - Pinch to zoom code editor
  - Pull down to refresh file list
- **Quick Access Toolbar**: Frequently used symbols and actions
- **One-Handed Mode**: Important actions accessible with thumb
- **Haptic Feedback**: Subtle vibrations for user actions

### 10. **Sample Content Structure**
```
components/
├── Layout/
│   ├── MobileHeader.tsx         # Top header with title and settings
│   ├── BottomNavigation.tsx     # Main navigation tabs
│   └── FloatingActionButton.tsx # Quick action button
├── Editor/
│   ├── MobileCodeEditor.tsx     # Touch-optimized code editor
│   ├── KeyboardToolbar.tsx      # Programming symbols toolbar
│   └── SyntaxHighlighter.tsx    # Mobile syntax highlighting
├── FileManager/
│   ├── TouchFileTree.tsx        # Mobile file explorer
│   ├── FileCard.tsx             # Individual file display
│   └── SwipeActions.tsx         # Swipe gesture handlers
├── Console/
│   ├── MobileConsole.tsx        # Output display area
│   └── ExecutionStatus.tsx      # Run status indicators
├── Templates/
│   ├── CodeTemplates.tsx        # Starter code snippets
│   └── ProjectTemplates.tsx     # New project options
└── Shared/
    ├── TouchButton.tsx          # Touch-optimized buttons
    ├── MobileModal.tsx          # Mobile-friendly modals
    └── GestureHandler.tsx       # Swipe and touch gestures
```

### 11. **Performance Optimization**
- Lazy loading for code editor components
- Virtual scrolling for large file lists
- Debounced input for real-time syntax highlighting
- Compressed code execution for faster mobile processing
- Efficient state management for smooth scrolling

### 12. **Integration Features**
- **Sync with Desktop**: Share projects between desktop IDE and mobile app
- **QR Code Sharing**: Generate QR codes for quick project sharing
- **Export Options**: Save code as files, share as images, or copy to clipboard
- **Cloud Storage**: Integration with popular cloud services for project backup

## Expected Output

A fully responsive mobile web application that provides a complete coding experience on mobile devices. The app should feel native-like with smooth animations, intuitive gestures, and optimized touch interactions. Users should be able to write, edit, and execute code comfortably on their phones while maintaining productivity.

## Technical Specifications

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with mobile-first approach
- **State Management**: Zustand or Context API for lightweight state management
- **Touch Handling**: React-based gesture libraries for swipe and touch interactions
- **Code Highlighting**: Lightweight syntax highlighting optimized for mobile
- **Build Tool**: Vite for fast development and optimized mobile builds

## Design Inspiration

Create an interface that combines the best aspects of:
- VS Code's clean, professional appearance
- Mobile-first apps like Notion or Linear
- Touch-optimized coding apps with intuitive gesture controls
- Modern mobile design patterns with smooth animations

The final product should be a mobile coding solution that developers actually want to use, bridging the gap between desktop development and mobile productivity.
