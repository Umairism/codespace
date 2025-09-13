import { FileNode, Project } from '../types';

// Utility to trigger file download
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Download a single file
export function downloadSingleFile(file: FileNode): void {
  if (!file.content) {
    console.warn('Cannot download file without content:', file.name);
    return;
  }

  const mimeTypes: Record<string, string> = {
    'js': 'text/javascript',
    'jsx': 'text/javascript',
    'ts': 'text/typescript',
    'tsx': 'text/typescript',
    'html': 'text/html',
    'css': 'text/css',
    'json': 'application/json',
    'py': 'text/x-python',
    'sql': 'text/sql',
    'md': 'text/markdown',
    'txt': 'text/plain',
    'xml': 'text/xml',
    'csv': 'text/csv'
  };

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = mimeTypes[extension] || 'text/plain';
  
  downloadFile(file.name, file.content, mimeType);
}

// Create ZIP file content (simple implementation)
function createZipContent(files: Array<{ name: string; content: string; path?: string }>): Blob {
  // For a simple implementation, we'll create a tar-like format
  // In a production app, you'd use a proper ZIP library like JSZip
  
  let zipContent = '';
  
  for (const file of files) {
    const fullPath = file.path ? `${file.path}/${file.name}` : file.name;
    const separator = '='.repeat(50);
    
    zipContent += `${separator}\n`;
    zipContent += `FILE: ${fullPath}\n`;
    zipContent += `SIZE: ${file.content.length} bytes\n`;
    zipContent += `${separator}\n`;
    zipContent += file.content;
    zipContent += '\n\n';
  }
  
  return new Blob([zipContent], { type: 'text/plain' });
}

// Flatten file tree to get all files with their paths
function flattenFileTree(files: FileNode[], basePath: string = ''): Array<{ name: string; content: string; path: string }> {
  const result: Array<{ name: string; content: string; path: string }> = [];
  
  for (const file of files) {
    const currentPath = basePath ? `${basePath}/${file.name}` : file.name;
    
    if (file.type === 'file' && file.content) {
      result.push({
        name: file.name,
        content: file.content,
        path: basePath
      });
    } else if (file.type === 'folder' && file.children) {
      result.push(...flattenFileTree(file.children, currentPath));
    }
  }
  
  return result;
}

// Download entire project as ZIP
export function downloadProject(project: Project): void {
  const allFiles = flattenFileTree(project.files);
  
  if (allFiles.length === 0) {
    console.warn('No files to download in project:', project.name);
    return;
  }
  
  // Add a README with project info
  const projectInfo = `# ${project.name}

Generated from CodeSpace IDE
Created: ${new Date().toLocaleString()}
Files: ${allFiles.length}

## Project Structure
${allFiles.map(f => `- ${f.path ? f.path + '/' : ''}${f.name}`).join('\n')}

## Usage
This project was exported from CodeSpace IDE. Each file is separated by a line of equals signs (=) with file information.
`;

  const filesWithReadme = [
    { name: 'README.md', content: projectInfo, path: '' },
    ...allFiles
  ];
  
  const zipBlob = createZipContent(filesWithReadme);
  const url = URL.createObjectURL(zipBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.replace(/[^a-zA-Z0-9-_]/g, '_')}.txt`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Download project as individual files (creates multiple downloads)
export function downloadProjectFiles(project: Project): void {
  const allFiles = flattenFileTree(project.files);
  
  if (allFiles.length === 0) {
    console.warn('No files to download in project:', project.name);
    return;
  }
  
  // Download each file individually with a small delay to avoid browser blocking
  allFiles.forEach((file, index) => {
    setTimeout(() => {
      const filename = file.path ? 
        `${project.name}_${file.path.replace(/[^a-zA-Z0-9-_]/g, '_')}_${file.name}` : 
        `${project.name}_${file.name}`;
      
      downloadFile(filename, file.content);
    }, index * 200); // 200ms delay between downloads
  });
}

// Advanced ZIP implementation using JSZip (for future enhancement)
export async function downloadProjectAsZip(project: Project): Promise<void> {
  // This would require adding JSZip as a dependency
  // For now, we'll use the simple text-based format
  
  try {
    // Check if JSZip is available (would need to be imported)
    // const JSZip = (window as any).JSZip;
    // if (JSZip) {
    //   const zip = new JSZip();
    //   // Add files to ZIP...
    // } else {
      // Fallback to simple download
      downloadProject(project);
    // }
  } catch (error) {
    console.warn('Advanced ZIP not available, using fallback:', error);
    downloadProject(project);
  }
}