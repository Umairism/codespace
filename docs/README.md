# CodeSpace Documentation

Welcome to the CodeSpace documentation! This guide will help you understand and extend the codebase.

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture Overview](#architecture-overview)
3. [Core Components](#core-components)
4. [Custom Hooks](#custom-hooks)
5. [Code Execution Engine](#code-execution-engine)
6. [File System](#file-system)
7. [UI Components](#ui-components)
8. [Development Workflow](#development-workflow)
9. [Testing](#testing)
10. [Deployment](#deployment)

## Getting Started

### Prerequisites
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Installation
```bash
git clone https://github.com/umairism/codespace.git
cd codespace
npm install
npm run dev
```

## Architecture Overview

CodeSpace follows a modern React architecture with clear separation of concerns:

```
src/
├── components/          # UI Components
│   ├── Editor/         # Code editor components
│   ├── Layout/         # App layout components
│   └── UI/             # Reusable UI elements
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── styles/             # Global styles
```

### Key Design Principles

1. **Component Composition**: Small, focused components that compose well
2. **Custom Hooks**: Business logic separated from UI components
3. **Type Safety**: Comprehensive TypeScript coverage
4. **Performance**: Optimized for smooth user experience
5. **Accessibility**: WCAG compliant with proper ARIA labels

## Core Components

### App.tsx
The main application component that orchestrates the entire IDE:

```typescript
// Core state management
const [currentProjectId, setCurrentProjectId] = useState<string>('default');
const [renderKey, setRenderKey] = useState(0);

// Feature integrations
const fileSystem = useFileSystem(currentProjectId);
const codeExecution = useCodeExecution();
const { addNotification } = useNotifications();
```

**Key Responsibilities:**
- State coordination between features
- Keyboard shortcut handling
- File operations (create, delete, rename)
- Menu and toolbar actions

### Monaco Editor Integration

```typescript
// CodeEditor.tsx
const handleEditorDidMount: OnMount = (editor, monaco) => {
  // Custom theme configuration
  monaco.editor.defineTheme('vs-dark-custom', {
    base: 'vs-dark',
    inherit: true,
    rules: [/* custom syntax highlighting */],
    colors: {/* custom color scheme */}
  });
  
  // Keyboard shortcuts
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // Save functionality
  });
};
```

## Custom Hooks

### useFileSystem
Manages project files and folder structure:

```typescript
interface FileSystemHook {
  currentProject: Project;
  createFile: (name: string, parentId?: string, type?: FileType) => FileNode;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  copyFile: (fileId: string) => void;
  pasteFile: (parentId?: string) => void;
  moveFile: (fileId: string, targetId: string) => void;
  // ... more methods
}
```

**Features:**
- Persistent storage with localStorage
- Hierarchical file structure
- Copy/paste operations
- Drag & drop support
- Auto-save functionality

### useCodeExecution
Handles code execution for multiple languages:

```typescript
interface CodeExecutionHook {
  output: ExecutionResult[];
  isExecuting: boolean;
  executeCode: (code: string, language: string) => Promise<void>;
  clearOutput: () => void;
}
```

**Supported Languages:**
- **Python**: Advanced interpreter with algorithm support
- **JavaScript**: Real-time execution with console capture
- **TypeScript**: Compilation and execution
- **HTML/CSS**: Live preview generation

## Code Execution Engine

### Python Execution
The Python execution engine is particularly sophisticated:

```typescript
// Advanced features supported:
// 1. Variable assignments with complex types
const assignMatch = trimmedLine.match(/^(\w+)\s*=\s*(.+)/);

// 2. Function definitions and calls
const funcMatch = trimmedLine.match(/^def\s+(\w+)\s*\((.*?)\):/);

// 3. Class definitions and object instantiation
const classMatch = trimmedLine.match(/^class\s+(\w+)(?:\s*\(.*?\))?:/);

// 4. Advanced data structures
if (value.match(/^\[.*\]$/)) {
  // List handling
} else if (value.match(/^\{.*\}$/)) {
  // Dictionary handling
}
```

**Algorithm Support:**
- N-Queens problem solving
- Sorting algorithms
- Graph traversals
- Dynamic programming
- Recursive functions

### JavaScript Execution
Real-time JavaScript execution with console capture:

```typescript
const originalLog = console.log;
const capturedOutput: string[] = [];

console.log = (...args) => {
  capturedOutput.push(args.join(' '));
};

try {
  eval(code);
} finally {
  console.log = originalLog;
}
```

## File System

### Data Structure
```typescript
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  parentId?: string;
  isExpanded?: boolean;
}

interface Project {
  id: string;
  name: string;
  files: FileNode[];
  openTabs: string[];
  activeFile?: string;
}
```

### Persistence
Projects are automatically saved to localStorage:

```typescript
const saveProject = useCallback((project: Project) => {
  const projects = getProjects();
  const updatedProjects = projects.map(p => 
    p.id === project.id ? project : p
  );
  localStorage.setItem('codespace-projects', JSON.stringify(updatedProjects));
}, []);
```

## UI Components

### Reusable Components
- **Button**: Consistent styling with variants
- **Modal**: Accessible modal dialogs
- **Tabs**: Tab management for open files
- **Tree**: File tree with drag & drop
- **Notifications**: Toast-style user feedback

### Layout Components
- **Sidebar**: File explorer and navigation
- **MainPanel**: Code editor and tabs
- **OutputPanel**: Execution results and terminal
- **PreviewPanel**: Live HTML/CSS preview

## Development Workflow

### Code Quality
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Formatting
npm run format

# Testing
npm test
npm run test:coverage
```

### Build Process
```bash
# Development
npm run dev          # Hot reload development server

# Production
npm run build        # Optimized production build
npm run preview      # Preview production build
```

### Environment Variables
```bash
# .env.local
VITE_APP_NAME=CodeSpace
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=your-analytics-id
```

## Testing

### Testing Strategy
1. **Unit Tests**: Individual components and hooks
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Complete user workflows

### Test Structure
```
src/
├── components/
│   └── __tests__/
├── hooks/
│   └── __tests__/
└── utils/
    └── __tests__/
```

### Example Test
```typescript
describe('useFileSystem', () => {
  it('should create a new file', () => {
    const { result } = renderHook(() => useFileSystem('test-project'));
    
    act(() => {
      const file = result.current.createFile('test.js');
      expect(file.name).toBe('test.js');
      expect(file.type).toBe('file');
    });
  });
});
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_APP_NAME=CodeSpace
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

## Performance Optimization

### Bundle Analysis
```bash
npm run build:analyze
```

### Key Optimizations
1. **Code Splitting**: Dynamic imports for large components
2. **Tree Shaking**: Eliminate unused code
3. **Asset Optimization**: Image compression and lazy loading
4. **Caching**: Proper cache headers and service worker

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed contribution guidelines.

## Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

**Type Errors**
```bash
# Check TypeScript
npm run type-check
```

**Performance Issues**
```bash
# Analyze bundle
npm run build:analyze
```

---

For more specific questions, please check our [FAQ](FAQ.md) or open an issue on GitHub.
