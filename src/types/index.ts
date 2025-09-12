export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
  parent?: string;
}

export interface Project {
  id: string;
  name: string;
  files: FileNode[];
  activeFile?: string;
  openTabs: string[];
}

export interface ExecutionResult {
  output: string;
  error?: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

export type PanelType = 'explorer' | 'search' | 'git' | 'extensions';
export type Language = 'javascript' | 'typescript' | 'python' | 'sql' | 'markdown' | 'json' | 'html' | 'css';