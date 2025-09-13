import { FileNode } from '../types';

export interface UploadOptions {
  multiple?: boolean;
  accept?: string;
  maxFileSize?: number; // in MB
}

export interface UploadResult {
  success: boolean;
  files: FileNode[];
  errors: string[];
}

/**
 * Trigger file upload dialog and process selected files
 */
export const uploadFiles = (options: UploadOptions = {}): Promise<UploadResult> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = options.multiple ?? true;
    input.accept = options.accept ?? '*/*';
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length === 0) {
        resolve({ success: false, files: [], errors: ['No files selected'] });
        return;
      }

      const result: UploadResult = {
        success: true,
        files: [],
        errors: []
      };

      const maxSize = (options.maxFileSize ?? 10) * 1024 * 1024; // Convert MB to bytes

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size
        if (file.size > maxSize) {
          result.errors.push(`File "${file.name}" is too large. Maximum size is ${options.maxFileSize ?? 10}MB`);
          continue;
        }

        try {
          const content = await readFileContent(file);
          const fileNode: FileNode = {
            id: `uploaded-${Date.now()}-${i}`,
            name: file.name,
            type: 'file',
            content: content,
            children: undefined
          };
          
          result.files.push(fileNode);
        } catch (error) {
          result.errors.push(`Failed to read file "${file.name}": ${error}`);
        }
      }

      if (result.errors.length > 0) {
        result.success = false;
      }

      resolve(result);
    };

    input.click();
  });
};

/**
 * Read file content as text
 */
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject('Failed to read file as text');
      }
    };
    
    reader.onerror = () => {
      reject('Error reading file');
    };

    // For binary files, we'll still read as text but may get garbled content
    // TODO: Add binary file detection and base64 encoding for images, etc.
    reader.readAsText(file);
  });
};

/**
 * Upload and process ZIP files
 */
export const uploadZipFile = async (): Promise<UploadResult> => {
  const result = await uploadFiles({
    multiple: false,
    accept: '.zip',
    maxFileSize: 50 // 50MB for ZIP files
  });

  if (!result.success || result.files.length === 0) {
    return result;
  }

  // TODO: Add ZIP extraction logic using JSZip library
  // For now, just return the ZIP file as-is
  return result;
};

/**
 * Check if a file is a text file based on extension
 */
export const isTextFile = (filename: string): boolean => {
  const textExtensions = [
    '.txt', '.md', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.sass',
    '.json', '.xml', '.yaml', '.yml', '.py', '.java', '.c', '.cpp', '.h', '.hpp',
    '.cs', '.php', '.rb', '.go', '.rs', '.sh', '.bat', '.ps1', '.sql', '.r', '.m',
    '.swift', '.kt', '.dart', '.vue', '.svelte', '.astro'
  ];
  
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return textExtensions.includes(extension);
};

/**
 * Get appropriate file icon based on file extension
 */
export const getFileIcon = (filename: string): string => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  
  const iconMap: { [key: string]: string } = {
    '.js': '📄',
    '.jsx': '⚛️',
    '.ts': '📘',
    '.tsx': '⚛️',
    '.html': '🌐',
    '.css': '🎨',
    '.scss': '🎨',
    '.sass': '🎨',
    '.json': '📋',
    '.md': '📝',
    '.py': '🐍',
    '.java': '☕',
    '.cpp': '⚙️',
    '.c': '⚙️',
    '.cs': '🔷',
    '.php': '🐘',
    '.rb': '💎',
    '.go': '🐹',
    '.rs': '🦀',
    '.swift': '🍎',
    '.kt': '🟣',
    '.dart': '🎯',
    '.vue': '💚',
    '.zip': '📦',
    '.pdf': '📕',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.png': '🖼️',
    '.gif': '🖼️',
    '.svg': '🖼️'
  };
  
  return iconMap[extension] || '📄';
};