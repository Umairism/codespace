import { useCallback } from 'react';
import { FileNode, Project } from '../types';
import { findFileById, generateFileId, updateFileInTree, removeFileFromTree } from '../utils/fileUtils';
import { useLocalStorage } from './useLocalStorage';

export function useFileSystem(initialProject: Project) {
  const [projects, setProjects] = useLocalStorage<Project[]>('ide-projects', [initialProject]);
  const [currentProjectId, setCurrentProjectId] = useLocalStorage<string>('ide-current-project', initialProject.id);
  
  // Fix project ID mismatch - ensure currentProjectId matches an actual project
  const foundProject = projects.find(p => p.id === currentProjectId);
  const currentProject = foundProject || projects[0];
  
  // If we had to fallback to projects[0], update the currentProjectId to match
  if (!foundProject && projects.length > 0) {
    console.log('Project ID mismatch detected, fixing...', { currentProjectId, actualProjectId: projects[0].id });
    setCurrentProjectId(projects[0].id);
  }
  
  // console.log('useFileSystem hook - currentProject:', currentProject);
  // console.log('useFileSystem hook - projects:', projects);
  // console.log('useFileSystem hook - currentProjectId:', currentProjectId);
  
  const updateProject = useCallback((updates: Partial<Project>) => {
    // console.log('updateProject called with:', updates);
    // console.log('Updating project with ID:', currentProject.id);
    setProjects(prev => {
      const newProjects = prev.map(p => 
        p.id === currentProject.id ? { ...p, ...updates } : p
      );
      // console.log('Projects updated:', newProjects);
      return newProjects;
    });
  }, [currentProject.id, setProjects]);

  const createFile = useCallback((name: string, parentId?: string, type: 'file' | 'folder' = 'file', customContent?: string) => {
    console.log('createFile called with:', { name, parentId, type, hasCustomContent: !!customContent });
    
    // Use custom content if provided, otherwise generate default content based on file type
    let defaultContent = '';
    if (customContent) {
      // Use the provided custom content
      defaultContent = customContent;
    } else if (type === 'file') {
      // Generate default content based on file extension
      const ext = name.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'js':
        case 'jsx':
          defaultContent = `// ${name}\nconsole.log('Hello from ${name}');`;
          break;
        case 'ts':
        case 'tsx':
          defaultContent = `// ${name}\nconsole.log('Hello from ${name}');`;
          break;
        case 'py':
          defaultContent = `# ${name}
# Python script example

def main():
    print("Hello from ${name}!")
    
    # Basic calculations
    x = 10
    y = 20
    result = x + y
    print(f"The sum of {x} + {y} = {result}")
    
    # Loop example
    print("Counting from 0 to 4:")
    for i in range(5):
        print(f"Count: {i}")

if __name__ == "__main__":
    main()`;
          break;
        case 'html':
          defaultContent = `<!DOCTYPE html>\n<html>\n<head>\n    <title>${name}</title>\n</head>\n<body>\n    <h1>Hello from ${name}</h1>\n</body>\n</html>`;
          break;
        default:
          defaultContent = `// ${name}\n// Start coding here...`;
      }
    }

    const newFile: FileNode = {
      id: generateFileId(),
      name,
      type,
      content: type === 'file' ? defaultContent : undefined,
      children: type === 'folder' ? [] : undefined,
      parent: parentId
    };

    if (parentId) {
      const updatedFiles = updateFileInTree(currentProject.files, parentId, {
        children: [...(findFileById(currentProject.files, parentId)?.children || []), newFile],
        isOpen: true
      });
      console.log('Updating files with parent:', updatedFiles);
      updateProject({ files: updatedFiles });
    } else {
      const newFiles = [...currentProject.files, newFile];
      console.log('Updating files (root level):', newFiles);
      updateProject({ files: newFiles });
    }

    console.log('File created successfully:', newFile);
    return newFile;
  }, [currentProject.files, updateProject]);

  const updateFile = useCallback((fileId: string, updates: Partial<FileNode>) => {
    const updatedFiles = updateFileInTree(currentProject.files, fileId, updates);
    updateProject({ files: updatedFiles });
  }, [currentProject.files, updateProject]);

  const deleteFile = useCallback((fileId: string) => {
    const updatedFiles = removeFileFromTree(currentProject.files, fileId);
    const updatedTabs = currentProject.openTabs.filter(id => id !== fileId);
    const newActiveFile = updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1] : undefined;
    
    updateProject({ 
      files: updatedFiles,
      openTabs: updatedTabs,
      activeFile: newActiveFile
    });
  }, [currentProject.files, currentProject.openTabs, updateProject]);

  const openFile = useCallback((fileId: string) => {
    const file = findFileById(currentProject.files, fileId);
    if (file && file.type === 'file') {
      const isAlreadyOpen = currentProject.openTabs.includes(fileId);
      const newTabs = isAlreadyOpen ? currentProject.openTabs : [...currentProject.openTabs, fileId];
      
      updateProject({
        openTabs: newTabs,
        activeFile: fileId
      });
    }
  }, [currentProject.files, currentProject.openTabs, updateProject]);

  const closeFile = useCallback((fileId: string) => {
    const updatedTabs = currentProject.openTabs.filter(id => id !== fileId);
    let newActiveFile = currentProject.activeFile;
    
    if (currentProject.activeFile === fileId) {
      newActiveFile = updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1] : undefined;
    }
    
    updateProject({
      openTabs: updatedTabs,
      activeFile: newActiveFile
    });
  }, [currentProject.openTabs, currentProject.activeFile, updateProject]);

  const setActiveFile = useCallback((fileId: string) => {
    updateProject({ activeFile: fileId });
  }, [updateProject]);

  const copyFile = useCallback((fileId: string) => {
    const file = findFileById(currentProject.files, fileId);
    if (file) {
      // Store the file info in localStorage for clipboard
      localStorage.setItem('ide-clipboard', JSON.stringify({
        file: file,
        action: 'copy'
      }));
      console.log('File copied to clipboard:', file.name);
    }
  }, [currentProject.files]);

  const pasteFile = useCallback((parentId?: string) => {
    const clipboardData = localStorage.getItem('ide-clipboard');
    if (!clipboardData) return;

    try {
      const { file: sourceFile } = JSON.parse(clipboardData);
      
      // Generate new ID for the copied file
      const newFile: FileNode = {
        ...sourceFile,
        id: generateFileId(),
        name: `${sourceFile.name.replace(/(\.[^.]+)?$/, '_copy$1')}`, // Add _copy suffix
        parent: parentId
      };

      // If copying a folder, recursively copy children with new IDs
      if (newFile.type === 'folder' && sourceFile.children) {
        const copyChildren = (children: FileNode[]): FileNode[] => {
          return children.map(child => ({
            ...child,
            id: generateFileId(),
            parent: newFile.id,
            children: child.children ? copyChildren(child.children) : undefined
          }));
        };
        newFile.children = copyChildren(sourceFile.children);
      }

      let updatedFiles;
      if (parentId) {
        // Paste into folder
        updatedFiles = updateFileInTree(currentProject.files, parentId, {
          children: [...(findFileById(currentProject.files, parentId)?.children || []), newFile],
          isOpen: true
        });
      } else {
        // Paste at root level
        updatedFiles = [...currentProject.files, newFile];
      }

      updateProject({ files: updatedFiles });
      
      // Clear clipboard after paste
      localStorage.removeItem('ide-clipboard');
      console.log('File pasted:', newFile.name);
      
      return newFile;
    } catch (error) {
      console.error('Error pasting file:', error);
    }
  }, [currentProject.files, updateProject]);

  const toggleFolder = useCallback((folderId: string) => {
    const folder = findFileById(currentProject.files, folderId);
    if (folder && folder.type === 'folder') {
      updateFile(folderId, { isOpen: !folder.isOpen });
    }
  }, [currentProject.files, updateFile]);

  const renameFile = useCallback((fileId: string, newName: string) => {
    updateFile(fileId, { name: newName });
  }, [updateFile]);

  const saveFile = useCallback((fileId: string, content: string) => {
    updateFile(fileId, { content });
  }, [updateFile]);

  const moveFile = useCallback((fileId: string, targetFolderId: string) => {
    const fileToMove = findFileById(currentProject.files, fileId);
    if (!fileToMove) return;

    // Remove file from its current location
    const filesWithoutMoved = removeFileFromTree(currentProject.files, fileId);
    
    // Update the file's parent
    const updatedFile = { ...fileToMove, parent: targetFolderId };
    
    // Add file to target folder
    const updatedFiles = updateFileInTree(filesWithoutMoved, targetFolderId, {
      children: [...(findFileById(filesWithoutMoved, targetFolderId)?.children || []), updatedFile],
      isOpen: true
    });

    updateProject({ files: updatedFiles });
    console.log('File moved:', fileToMove.name, 'to folder:', targetFolderId);
  }, [currentProject.files, updateProject]);

  return {
    currentProject,
    projects,
    setCurrentProjectId,
    createFile,
    updateFile,
    deleteFile,
    openFile,
    closeFile,
    setActiveFile,
    toggleFolder,
    renameFile,
    saveFile,
    copyFile,
    pasteFile,
    moveFile
  };
}