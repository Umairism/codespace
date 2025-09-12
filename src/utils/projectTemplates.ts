import { Project } from '../types';
import { generateFileId } from './fileUtils';

export const createJavaScriptProject = (): Project => ({
  id: generateFileId(),
  name: 'New JavaScript Project',
  openTabs: ['main-js'],
  activeFile: 'main-js',
  files: [
    {
      id: 'main-js',
      name: 'main.js',
      type: 'file',
      language: 'javascript',
      content: `// Write your JavaScript code here
console.log('Hello, World!');`
    }
  ]
});

export const createPythonProject = (): Project => ({
  id: generateFileId(),
  name: 'New Python Project',
  openTabs: ['main-py'],
  activeFile: 'main-py',
  files: [
    {
      id: 'main-py',
      name: 'main.py',
      type: 'file',
      language: 'python',
      content: `# Write your Python code here
print("Hello, World!")`
    }
  ]
});

export const createSQLProject = (): Project => ({
  id: generateFileId(),
  name: 'New SQL Project',
  openTabs: ['main-sql'],
  activeFile: 'main-sql',
  files: [
    {
      id: 'main-sql',
      name: 'main.sql',
      type: 'file',
      language: 'sql',
      content: `-- Write your SQL queries here
SELECT 'Hello, World!' AS message;`
    }
  ]
});

export const createEmptyProject = (): Project => ({
  id: generateFileId(),
  name: 'New Project',
  openTabs: [],
  activeFile: undefined,
  files: []
});

export const getDefaultProjects = (): Project[] => [
  createJavaScriptProject()
];

// Ensure all exports are available
export default {
  createJavaScriptProject,
  createPythonProject, 
  createSQLProject,
  createEmptyProject,
  getDefaultProjects
};