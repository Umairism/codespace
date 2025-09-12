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
import { FindDialog } from './components/UI/FindDialog';
import { SettingsDialog } from './components/UI/SettingsDialog';
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
  
  // Find/Replace states
  const [findVisible, setFindVisible] = useState(false);
  const [replaceVisible, setReplaceVisible] = useState(false);
  const [findInFilesVisible, setFindInFilesVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  
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
    const fileName = prompt('Enter file name:');
    if (fileName && fileName.trim()) {
      const newFile = createFile(fileName.trim());
      openFile(newFile.id);
      setRenderKey(prev => prev + 1);
      addNotification('success', `File "${fileName.trim()}" created successfully`);
    } else {
      addNotification('info', 'File creation cancelled');
    }
  }, [createFile, openFile, addNotification]);

  const handleNewFolder = useCallback(() => {
    const folderName = prompt('Enter folder name:');
    console.log('New folder dialog result:', folderName);
    if (folderName?.trim()) {
      console.log('Creating folder:', folderName.trim());
      const newFolder = createFile(folderName.trim(), undefined, 'folder');
      console.log('Created folder:', newFolder);
      // Force re-render
      setRenderKey(prev => prev + 1);
      addNotification('success', `Folder "${folderName.trim()}" created successfully`);
    } else {
      console.log('Folder creation cancelled or empty name');
      addNotification('info', 'Folder creation cancelled');
    }
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
    const fileName = prompt('Enter file name:');
    if (fileName?.trim()) {
      const newFile = createFile(fileName.trim(), parentId);
      openFile(newFile.id);
    }
  }, [createFile, openFile]);

  const handleCreateFolder = useCallback((parentId?: string) => {
    const folderName = prompt('Enter folder name:');
    if (folderName?.trim()) {
      createFile(folderName.trim(), parentId, 'folder');
    }
  }, [createFile]);

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
    if (confirm('Are you sure you want to delete this item?')) {
      deleteFile(fileId);
    }
  }, [deleteFile]);

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

  // Find/Replace functionality
  const handleFindInEditor = useCallback((text: string, _options: any) => {
    if (monacoEditor) {
      monacoEditor.getAction('actions.find').run();
      addNotification('info', `Opening find widget for: "${text}"`);
    } else {
      addNotification('info', `Searching for: "${text}"`);
    }
  }, [monacoEditor, addNotification]);

  const handleReplaceInEditor = useCallback((findText: string, replaceText: string, _options: any) => {
    if (monacoEditor) {
      monacoEditor.getAction('editor.action.startFindReplaceAction').run();
      addNotification('info', `Opening replace widget: "${findText}" → "${replaceText}"`);
    } else {
      addNotification('info', `Replace "${findText}" with "${replaceText}"`);
    }
  }, [monacoEditor, addNotification]);

  const handleReplaceAllInEditor = useCallback((findText: string, replaceText: string, _options: any) => {
    if (monacoEditor) {
      monacoEditor.getAction('editor.action.startFindReplaceAction').run();
      addNotification('info', `Replace all: "${findText}" → "${replaceText}"`);
    } else {
      addNotification('info', `Replace all "${findText}" with "${replaceText}"`);
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
    setFindVisible(true);
    console.log('Opening find dialog...');
  }, []);

  const handleReplace = useCallback(() => {
    setReplaceVisible(true);
    console.log('Opening replace dialog...');
  }, []);

  const handleFindInFiles = useCallback(() => {
    setFindInFilesVisible(true);
    console.log('Opening find in files...');
  }, []);

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
      
      <div className="flex-1 flex overflow-hidden">
        {sidebarVisible && (
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
          />
        )}
        
        {sidebarVisible && (
          <div 
            className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
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
        )}
        
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <MainPanel
            files={currentProject.files}
            openTabs={currentProject.openTabs}
            activeFileId={currentProject.activeFile}
            onTabClick={setActiveFile}
            onTabClose={closeFile}
            onFileChange={handleFileChange}
            className="flex-1"
          />
          {previewVisible && (
              <>
                <div 
                  className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
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
                
                <PreviewPanel
                  files={currentProject.files}
                  activeFileId={currentProject.activeFile}
                  width={previewWidth}
                />
              </>
            )}
          </div>
          
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
              
              <OutputPanel
                output={output}
                isExecuting={isExecuting}
                onRun={handleRun}
                onClear={clearOutput}
                height={outputHeight}
              />
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <FindDialog
        visible={findVisible}
        onClose={() => setFindVisible(false)}
        mode="find"
        onFind={handleFindInEditor}
      />
      
      <FindDialog
        visible={replaceVisible}
        onClose={() => setReplaceVisible(false)}
        mode="replace"
        onFind={handleFindInEditor}
        onReplace={handleReplaceInEditor}
        onReplaceAll={handleReplaceAllInEditor}
      />
      
      <FindDialog
        visible={findInFilesVisible}
        onClose={() => setFindInFilesVisible(false)}
        mode="findInFiles"
        onFind={handleFindInEditor}
      />
      
      <SettingsDialog
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onSaveSettings={handleSaveSettings}
        currentSettings={settings}
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