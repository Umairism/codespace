import { useState, useCallback } from 'react';
import { Menu } from './components/UI/Menu';
import { Sidebar } from './components/Layout/Sidebar';
import { MainPanel } from './components/Layout/MainPanel';
import { OutputPanel } from './components/Layout/OutputPanel';
import { PreviewPanel } from './components/Layout/PreviewPanel';
import { useFileSystem } from './hooks/useFileSystem';
import { useCodeExecution } from './hooks/useCodeExecution';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getDefaultProjects } from './utils/projectTemplates';
import { getLanguageFromExtension, getFileExtension } from './utils/fileUtils';
import { downloadProject, downloadProjectFiles } from './utils/fileDownload';
import { SettingsDialog } from './components/UI/SettingsDialog';
import { InputDialog } from './components/UI/InputDialog';
import { ConfirmDialog } from './components/UI/ConfirmDialog';
import { ProjectTemplateDialog } from './components/UI/ProjectTemplateDialog';
import { NotificationSystem, useNotifications } from './components/UI/NotificationSystem';
import { MonacoEditorContext } from './contexts/MonacoEditorContext';

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [outputHeight, setOutputHeight] = useState(200);
  const [previewWidth, setPreviewWidth] = useState(400);
  
  // Monaco Editor state
  const [monacoEditor, setMonacoEditor] = useState<any>(null);
  
  // UI visibility states
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);
  
  // UI dialog states
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [projectTemplateVisible, setProjectTemplateVisible] = useState(false);
  const [inputDialogVisible, setInputDialogVisible] = useState(false);
  const [inputDialogConfig, setInputDialogConfig] = useState({
    title: '',
    placeholder: '',
    onConfirm: (_value: string) => {}
  });
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  // Force re-render key for debugging
  const [renderKey, setRenderKey] = useState(0);

  // Settings state
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    autoSave: true,
    minimap: false
  });
  
  // Notifications
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Initialize with the first default project
  const defaultProjects = getDefaultProjects();
  const fileSystem = useFileSystem(defaultProjects[0]);
  const codeExecution = useCodeExecution();

  const {
    currentProject,
    createFile,
    openFile,
    closeFile,
    setActiveFile,
    toggleFolder,
    renameFile,
    deleteFile,
    saveFile,
    copyFile,
    pasteFile,
    moveFile
  } = fileSystem;

  const { output, isExecuting, executeCode, clearOutput } = codeExecution;

  const handleNewFile = useCallback(() => {
    setInputDialogConfig({
      title: 'Create New File',
      placeholder: 'Enter file name (e.g., script.js, index.html)...',
      onConfirm: (fileName: string) => {
        const newFile = createFile(fileName);
        openFile(newFile.id);
        setRenderKey(prev => prev + 1);
        addNotification('success', `File "${fileName}" created successfully`);
        setInputDialogVisible(false);
      }
    });
    setInputDialogVisible(true);
  }, [createFile, openFile, addNotification]);

  const handleNewFolder = useCallback(() => {
    setInputDialogConfig({
      title: 'Create New Folder',
      placeholder: 'Enter folder name...',
      onConfirm: (folderName: string) => {
        createFile(folderName, undefined, 'folder');
        setRenderKey(prev => prev + 1);
        addNotification('success', `Folder "${folderName}" created successfully`);
        setInputDialogVisible(false);
      }
    });
    setInputDialogVisible(true);
  }, [createFile, addNotification]);

  const handleSave = useCallback(() => {
    if (currentProject.activeFile) {
      const activeFile = currentProject.files.find(f => f.id === currentProject.activeFile);
      if (activeFile && activeFile.content !== undefined) {
        console.log(`Saving file: ${activeFile.name}`);
        // Trigger save through the file system
        saveFile(currentProject.activeFile, activeFile.content);
        // Show save confirmation
        addNotification('success', `File "${activeFile.name}" saved successfully!`);
      }
    }
  }, [currentProject.activeFile, currentProject.files, saveFile, addNotification]);

  const handleRun = useCallback(async () => {
    if (!currentProject.activeFile) return;
    
    const activeFile = currentProject.files.find(f => f.id === currentProject.activeFile);
    if (!activeFile || !activeFile.content) return;

    // Ensure terminal is visible when running code
    setTerminalVisible(true);
    
    const language = getLanguageFromExtension(getFileExtension(activeFile.name));
    await executeCode(activeFile.content, language);
  }, [currentProject.activeFile, currentProject.files, executeCode]);

  const handleFileChange = useCallback((fileId: string, content: string) => {
    saveFile(fileId, content);
  }, [saveFile]);

  const handleCreateFile = useCallback((parentId?: string) => {
    setInputDialogConfig({
      title: 'Create New File',
      placeholder: 'Enter file name (e.g., script.js, index.html)...',
      onConfirm: (fileName: string) => {
        const newFile = createFile(fileName, parentId);
        openFile(newFile.id);
        setRenderKey(prev => prev + 1);
        addNotification('success', `File "${fileName}" created successfully`);
        setInputDialogVisible(false);
      }
    });
    setInputDialogVisible(true);
  }, [createFile, openFile, addNotification]);

  const handleCreateFolder = useCallback((parentId?: string) => {
    setInputDialogConfig({
      title: 'Create New Folder',
      placeholder: 'Enter folder name...',
      onConfirm: (folderName: string) => {
        createFile(folderName, parentId, 'folder');
        setRenderKey(prev => prev + 1);
        addNotification('success', `Folder "${folderName}" created successfully`);
        setInputDialogVisible(false);
      }
    });
    setInputDialogVisible(true);
  }, [createFile, addNotification]);

  const handleCopy = useCallback((fileId: string) => {
    copyFile(fileId);
    addNotification('success', 'File copied to clipboard');
  }, [copyFile, addNotification]);

  const handlePaste = useCallback((parentId?: string) => {
    const pastedFile = pasteFile(parentId);
    if (pastedFile) {
      addNotification('success', `File pasted: ${pastedFile.name}`);
      // Force re-render
      setRenderKey(prev => prev + 1);
    } else {
      addNotification('info', 'Nothing to paste');
    }
  }, [pasteFile, addNotification]);

  const handleMove = useCallback((fileId: string, targetId: string) => {
    moveFile(fileId, targetId);
    addNotification('success', 'File moved successfully');
    // Force re-render
    setRenderKey(prev => prev + 1);
  }, [moveFile, addNotification]);

  const handleRename = useCallback((fileId: string, newName: string) => {
    renameFile(fileId, newName);
  }, [renameFile]);

  const handleDelete = useCallback((fileId: string) => {
    const file = currentProject.files.find(f => f.id === fileId);
    const fileName = file?.name || 'this item';
    
    setConfirmDialogConfig({
      title: 'Delete Item',
      message: `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteFile(fileId);
        addNotification('success', `"${fileName}" deleted successfully`);
        setConfirmDialogVisible(false);
      }
    });
    setConfirmDialogVisible(true);
  }, [deleteFile, currentProject.files, addNotification]);

  // Menu handlers
  const handleSaveAll = useCallback(() => {
    // Save all open files
    let savedCount = 0;
    currentProject.openTabs.forEach(fileId => {
      const file = currentProject.files.find(f => f.id === fileId);
      if (file && file.content !== undefined) {
        console.log(`Saving file: ${file.name}`);
        saveFile(fileId, file.content);
        savedCount++;
      }
    });
    addNotification('success', `${savedCount} files saved successfully!`);
  }, [currentProject, saveFile, addNotification]);

  const handleSettings = useCallback(() => {
    setSettingsVisible(true);
    console.log('Opening settings...');
  }, []);

  const handleSaveSettings = useCallback((newSettings: any) => {
    setSettings(newSettings);
    console.log('Settings updated:', newSettings);
    // Apply settings to Monaco Editor would happen here
    addNotification('success', 'Settings saved successfully!');
  }, [addNotification]);

  const handleDownloadProject = useCallback(() => {
    try {
      downloadProject(currentProject);
      addNotification('success', `Project "${currentProject.name}" downloaded successfully!`);
    } catch (error) {
      console.error('Failed to download project:', error);
      addNotification('error', 'Failed to download project');
    }
  }, [currentProject, addNotification]);

  const handleDownloadProjectFiles = useCallback(() => {
    try {
      downloadProjectFiles(currentProject);
      addNotification('success', `All files from "${currentProject.name}" will be downloaded individually`);
    } catch (error) {
      console.error('Failed to download project files:', error);
      addNotification('error', 'Failed to download project files');
    }
  }, [currentProject, addNotification]);

  const handleNewProject = useCallback(() => {
    setProjectTemplateVisible(true);
  }, []);

  const handleSelectTemplate = useCallback((templateId: string) => {
    // Import the template functions
    import('./utils/projectTemplates').then((templates) => {
      let newProject;
      switch (templateId) {
        case 'html':
          newProject = templates.createHtmlProject();
          break;
        case 'react':
          newProject = templates.createReactProject();
          break;
        case 'bootstrap':
          newProject = templates.createBootstrapProject();
          break;
        case 'javascript':
          newProject = templates.createJavaScriptProject();
          break;
        case 'python':
          newProject = templates.createPythonProject();
          break;
        case 'flask':
          newProject = templates.createFlaskProject();
          break;
        case 'datascience':
          newProject = templates.createDataScienceProject();
          break;
        case 'empty':
          newProject = templates.createEmptyProject();
          break;
        default:
          newProject = templates.createHtmlProject();
      }
      
      // Clear current project and load the new template
      localStorage.setItem('ide-projects', JSON.stringify([newProject]));
      localStorage.setItem('ide-current-project', newProject.id);
      
      // Force page reload to properly initialize the new project
      window.location.reload();
    });
  }, []);

  // Find/Replace functionality - Direct Monaco actions without dialogs
  const handleFindInEditor = useCallback(() => {
    if (monacoEditor) {
      monacoEditor.getAction('actions.find').run();
    } else {
      addNotification('info', 'No active editor');
    }
  }, [monacoEditor, addNotification]);

  const handleReplaceInEditor = useCallback(() => {
    if (monacoEditor) {
      monacoEditor.getAction('editor.action.startFindReplaceAction').run();
    } else {
      addNotification('info', 'No active editor');
    }
  }, [monacoEditor, addNotification]);



  const handleUndo = useCallback(() => {
    // Monaco Editor handles undo/redo automatically with Ctrl+Z/Ctrl+Y
    // This is a backup trigger for menu clicks
    console.log('Undo triggered from menu');
    addNotification('info', 'Use Ctrl+Z for undo in the editor');
  }, [addNotification]);

  const handleRedo = useCallback(() => {
    // Monaco Editor handles undo/redo automatically with Ctrl+Z/Ctrl+Y  
    // This is a backup trigger for menu clicks
    console.log('Redo triggered from menu');
    addNotification('info', 'Use Ctrl+Y for redo in the editor');
  }, [addNotification]);

  const handleFind = useCallback(() => {
    handleFindInEditor();
  }, [handleFindInEditor]);

  const handleReplace = useCallback(() => {
    handleReplaceInEditor();
  }, [handleReplaceInEditor]);

  const handleFindInFiles = useCallback(() => {
    // For now, just use Monaco's find in current file
    handleFindInEditor();
  }, [handleFindInEditor]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarVisible(prev => !prev);
  }, []);

  const handleToggleTerminal = useCallback(() => {
    setTerminalVisible(prev => !prev);
  }, []);

  const handleTogglePreview = useCallback(() => {
    setPreviewVisible(prev => !prev);
  }, []);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onNewFile: handleNewFile,
    onSave: handleSave,
    onSaveAll: handleSaveAll,
    onFind: handleFind,
    onReplace: handleReplace,
    onFindInFiles: handleFindInFiles,
    onRun: handleRun,
    onToggleSidebar: handleToggleSidebar,
    onToggleTerminal: handleToggleTerminal,
    onTogglePreview: handleTogglePreview,
  });

  return (
    <MonacoEditorContext.Provider value={{ editor: monacoEditor, setEditor: setMonacoEditor }}>
      <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <Menu
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onNewProject={handleNewProject}
        onSave={handleSave}
        onSaveAll={handleSaveAll}
        onSettings={handleSettings}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onFind={handleFind}
        onReplace={handleReplace}
        onFindInFiles={handleFindInFiles}
        onRun={handleRun}
        onToggleSidebar={handleToggleSidebar}
        onToggleTerminal={handleToggleTerminal}
        onTogglePreview={handleTogglePreview}
      />
      
      {/* Debug indicator */}
      <div className="bg-blue-900 text-white px-2 py-1 text-xs border-b border-blue-700">
        Active: {currentProject.activeFile || 'None'} | 
        Tabs: [{currentProject.openTabs.join(', ')}] | 
        Files: {currentProject.files.map(f => f.name).join(', ')}
        <button 
          onClick={() => setRenderKey(prev => prev + 1)} 
          className="ml-2 px-2 py-1 bg-green-600 rounded text-xs"
        >
          Force Refresh ({renderKey})
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }} 
          className="ml-2 px-2 py-1 bg-red-600 rounded text-xs"
        >
          Clear Storage
        </button>
      </div>
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        {sidebarVisible && (
          <>
            <div 
              className="absolute left-0 top-0 bottom-0 z-10"
              style={{ width: `${sidebarWidth}px` }}
            >
              <Sidebar
                key={renderKey}
                files={currentProject.files}
                activeFileId={currentProject.activeFile}
                onFileClick={openFile}
                onCreateFile={handleCreateFile}
                onCreateFolder={handleCreateFolder}
                onRename={handleRename}
                onDelete={handleDelete}
                onToggleFolder={toggleFolder}
                onCopy={handleCopy}
                onPaste={handlePaste}
                onMove={handleMove}
                width={sidebarWidth}
                className="h-full"
              />
            </div>
            
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors z-20"
              style={{ left: `${sidebarWidth}px` }}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = sidebarWidth;
                
                const handleMouseMove = (e: MouseEvent) => {
                  const diff = e.clientX - startX;
                  const newWidth = Math.max(200, Math.min(600, startWidth + diff));
                  setSidebarWidth(newWidth);
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </>
        )}
        
        {/* Main content area */}
        <div 
          className="absolute top-0 bottom-0 flex flex-col overflow-hidden"
          style={{ 
            left: sidebarVisible ? `${sidebarWidth + 4}px` : '0px',
            right: previewVisible ? `${previewWidth + 4}px` : '0px'
          }}
        >
          <div 
            className="flex-1 overflow-hidden"
            style={{ 
              bottom: terminalVisible ? `${outputHeight + 4}px` : '0px'
            }}
          >
            <MainPanel
              files={currentProject.files}
              openTabs={currentProject.openTabs}
              activeFileId={currentProject.activeFile}
              onTabClick={setActiveFile}
              onTabClose={closeFile}
              onFileChange={handleFileChange}
              settings={settings}
              className="h-full"
            />
          </div>
          
          {/* Terminal/Output Panel */}
          {terminalVisible && (
            <>
              <div 
                className="h-1 bg-gray-700 hover:bg-blue-500 cursor-row-resize transition-colors"
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startHeight = outputHeight;
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const diff = startY - e.clientY;
                    const newHeight = Math.max(150, Math.min(400, startHeight + diff));
                    setOutputHeight(newHeight);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
              
              <div style={{ height: `${outputHeight}px` }}>
                <OutputPanel
                  output={output}
                  isExecuting={isExecuting}
                  onRun={handleRun}
                  onClear={clearOutput}
                  height={outputHeight}
                />
              </div>
            </>
          )}
        </div>
        
        {/* Preview Panel */}
        {previewVisible && (
          <>
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors z-20"
              style={{ right: `${previewWidth}px` }}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = previewWidth;
                
                const handleMouseMove = (e: MouseEvent) => {
                  const diff = startX - e.clientX;
                  const newWidth = Math.max(300, Math.min(800, startWidth + diff));
                  setPreviewWidth(newWidth);
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
            
            <div 
              className="absolute right-0 top-0 bottom-0"
              style={{ width: `${previewWidth}px` }}
            >
              <PreviewPanel
                files={currentProject.files}
                activeFileId={currentProject.activeFile}
                width={previewWidth}
                className="h-full"
              />
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      <SettingsDialog
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onSaveSettings={handleSaveSettings}
        currentSettings={settings}
      />
      
      <InputDialog
        visible={inputDialogVisible}
        title={inputDialogConfig.title}
        placeholder={inputDialogConfig.placeholder}
        onConfirm={inputDialogConfig.onConfirm}
        onCancel={() => setInputDialogVisible(false)}
      />
      
      <ConfirmDialog
        visible={confirmDialogVisible}
        title={confirmDialogConfig.title}
        message={confirmDialogConfig.message}
        onConfirm={confirmDialogConfig.onConfirm}
        onCancel={() => setConfirmDialogVisible(false)}
        confirmText="Delete"
        type="danger"
      />
      
      <ProjectTemplateDialog
        visible={projectTemplateVisible}
        onClose={() => setProjectTemplateVisible(false)}
        onSelectTemplate={handleSelectTemplate}
      />
      
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onClose={removeNotification}
      />
      </div>
    </MonacoEditorContext.Provider>
  );
}

export default App;