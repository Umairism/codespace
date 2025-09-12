import { FileNode } from '../types';

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || '';
};

export const getLanguageFromExtension = (extension: string): string => {
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'sql': 'sql',
    'md': 'markdown',
    'json': 'json',
    'html': 'html',
    'css': 'css',
    'txt': 'plaintext'
  };
  return languageMap[extension] || 'plaintext';
};

export const generateFileId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const findFileById = (files: FileNode[], id: string): FileNode | null => {
  for (const file of files) {
    if (file.id === id) {
      return file;
    }
    if (file.children) {
      const found = findFileById(file.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const findParentFolder = (files: FileNode[], targetId: string): FileNode | null => {
  for (const file of files) {
    if (file.type === 'folder' && file.children) {
      if (file.children.some(child => child.id === targetId)) {
        return file;
      }
      const found = findParentFolder(file.children, targetId);
      if (found) return found;
    }
  }
  return null;
};

export const updateFileInTree = (files: FileNode[], fileId: string, updates: Partial<FileNode>): FileNode[] => {
  return files.map(file => {
    if (file.id === fileId) {
      return { ...file, ...updates };
    }
    if (file.children) {
      return {
        ...file,
        children: updateFileInTree(file.children, fileId, updates)
      };
    }
    return file;
  });
};

export const removeFileFromTree = (files: FileNode[], fileId: string): FileNode[] => {
  return files.filter(file => {
    if (file.id === fileId) {
      return false;
    }
    if (file.children) {
      file.children = removeFileFromTree(file.children, fileId);
    }
    return true;
  });
};