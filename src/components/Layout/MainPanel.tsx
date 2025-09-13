import { TabManager } from '../Editor/TabManager';
import { CodeEditor } from '../Editor/CodeEditor';
import { FileNode } from '../../types';
import { findFileById } from '../../utils/fileUtils';

interface Settings {
  theme: string;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  autoSave: boolean;
  minimap: boolean;
}

interface MainPanelProps {
  files: FileNode[];
  openTabs: string[];
  activeFileId?: string;
  onTabClick: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
  onFileChange: (fileId: string, content: string) => void;
  settings?: Settings;
  className?: string;
}

export function MainPanel({
  files,
  openTabs,
  activeFileId,
  onTabClick,
  onTabClose,
  onFileChange,
  settings,
  className = ''
}: MainPanelProps) {
  const activeFile = activeFileId ? findFileById(files, activeFileId) : null;

  return (
    <div className={`flex flex-col bg-gray-900 h-full overflow-hidden ${className}`}>
      <TabManager
        files={files}
        openTabs={openTabs}
        activeFileId={activeFileId}
        onTabClick={onTabClick}
        onTabClose={onTabClose}
      />
      
      <div className="flex-1 overflow-hidden">
        {activeFile ? (
          <CodeEditor
            file={activeFile}
            onChange={(content) => onFileChange(activeFile.id, content)}
            settings={settings}
            className="h-full w-full"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-900">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">💻</div>
              <h2 className="text-xl font-semibold mb-2">Welcome to CodeSpace</h2>
              <p>Select a file to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}