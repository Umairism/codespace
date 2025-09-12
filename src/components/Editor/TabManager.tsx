import { X, File } from 'lucide-react';
import { FileNode } from '../../types';
import { findFileById } from '../../utils/fileUtils';

interface TabManagerProps {
  files: FileNode[];
  openTabs: string[];
  activeFileId?: string;
  onTabClick: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
  className?: string;
}

export function TabManager({
  files,
  openTabs,
  activeFileId,
  onTabClick,
  onTabClose,
  className = ''
}: TabManagerProps) {
  const openFiles = openTabs.map(id => findFileById(files, id)).filter(Boolean) as FileNode[];

  if (openFiles.length === 0) {
    return (
      <div className={`flex items-center justify-center h-12 border-b border-gray-700 bg-gray-800 ${className}`}>
        <span className="text-gray-500 text-sm">No files open</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center h-12 border-b border-gray-700 bg-gray-800 overflow-x-auto ${className}`}>
      {openFiles.map((file) => {
        const isActive = file.id === activeFileId;
        
        return (
          <div
            key={file.id}
            className={`group flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer min-w-0 flex-shrink-0 max-w-48 ${
              isActive 
                ? 'bg-gray-900 text-white border-t-2 border-t-blue-500' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onTabClick(file.id)}
          >
            <File className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate text-sm">{file.name}</span>
            {isActive && <span className="ml-1 text-blue-400">●</span>}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(file.id);
              }}
              className="ml-2 p-0.5 opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded flex-shrink-0 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}