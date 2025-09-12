import React, { useState } from 'react';
import { 
  File, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Copy,
  Clipboard
} from 'lucide-react';
import { FileNode } from '../../types';
import { getFileExtension } from '../../utils/fileUtils';

interface FileTreeProps {
  files: FileNode[];
  activeFileId?: string;
  onFileClick: (fileId: string) => void;
  onCreateFile: (parentId?: string) => void;
  onCreateFolder: (parentId?: string) => void;
  onRename: (fileId: string, newName: string) => void;
  onDelete: (fileId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onCopy: (fileId: string) => void;
  onPaste: (parentId?: string) => void;
  onMove: (fileId: string, targetId: string) => void;
  className?: string;
}

interface FileItemProps {
  file: FileNode;
  level: number;
  activeFileId?: string;
  onFileClick: (fileId: string) => void;
  onCreateFile: (parentId?: string) => void;
  onCreateFolder: (parentId?: string) => void;
  onRename: (fileId: string, newName: string) => void;
  onDelete: (fileId: string) => void;
  onToggleFolder: (folderId: string) => void;
  onCopy: (fileId: string) => void;
  onPaste: (parentId?: string) => void;
  onMove: (fileId: string, targetId: string) => void;
  clipboardFile?: string;
}

function getFileIcon(fileName: string) {
  const ext = getFileExtension(fileName).toLowerCase();
  
  const iconMap: Record<string, React.ComponentType<any>> = {
    'js': FileText,
    'jsx': FileText,
    'ts': FileText,
    'tsx': FileText,
    'py': FileText,
    'sql': FileText,
    'json': FileText,
    'md': FileText,
    'html': FileText,
    'css': FileText
  };
  
  return iconMap[ext] || File;
}

function FileItem({
  file,
  level,
  activeFileId,
  onFileClick,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onToggleFolder,
  onCopy,
  onPaste,
  onMove,
  clipboardFile
}: FileItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      onRename(file.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(file.name);
      setIsRenaming(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', file.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (file.type === 'folder') {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const draggedFileId = e.dataTransfer.getData('text/plain');
    if (draggedFileId && draggedFileId !== file.id && file.type === 'folder') {
      onMove(draggedFileId, file.id);
    }
  };

  const FileIcon = file.type === 'folder' 
    ? (file.isOpen ? FolderOpen : Folder)
    : getFileIcon(file.name);

  const isActive = file.id === activeFileId;

  return (
    <div className="relative">
      <div
        draggable
        className={`group flex items-center py-1 px-2 text-sm cursor-move hover:bg-gray-700 ${
          isActive ? 'bg-gray-600 text-white' : 'text-gray-300'
        } ${isDragOver ? 'bg-blue-600 bg-opacity-30 border-l-4 border-blue-500' : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (file.type === 'folder') {
            onToggleFolder(file.id);
          } else {
            onFileClick(file.id);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowContextMenu(true);
        }}
      >
        <div className="flex items-center flex-1 min-w-0">
          {file.type === 'folder' && (
            <div className="mr-1">
              {file.isOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </div>
          )}
          
          <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-800 text-white px-1 py-0.5 text-sm border border-blue-500 rounded"
              autoFocus
            />
          ) : (
            <span className="truncate">{file.name}</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Context menu button clicked for:', file.name);
            console.log('Current showContextMenu state:', showContextMenu);
            setShowContextMenu(!showContextMenu);
          }}
          className="opacity-70 hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-opacity"
          title="More actions"
          style={{ minWidth: '20px', minHeight: '20px' }}
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>

        {showContextMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => {
                console.log('Backdrop clicked, closing menu');
                setShowContextMenu(false);
              }}
            />
            <div className="absolute right-0 top-full z-50 bg-gray-800 border border-gray-600 rounded shadow-xl py-1 min-w-40">
              {/* {console.log('Rendering context menu for:', file.name)} */}
              {file.type === 'folder' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('New File clicked');
                      onCreateFile(file.id);
                      setShowContextMenu(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New File
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('New Folder clicked');
                      onCreateFolder(file.id);
                      setShowContextMenu(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    New Folder
                  </button>
                  <div className="border-t border-gray-700 my-1" />
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(file.id);
                  setShowContextMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
              {clipboardFile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPaste(file.type === 'folder' ? file.id : undefined);
                    setShowContextMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Paste
                </button>
              )}
              <div className="border-t border-gray-700 my-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                  setShowContextMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(file.id);
                  setShowContextMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {file.type === 'folder' && file.isOpen && file.children && (
        <div>
          {file.children.map((child) => (
            <FileItem
              key={child.id}
              file={child}
              level={level + 1}
              activeFileId={activeFileId}
              onFileClick={onFileClick}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onDelete={onDelete}
              onToggleFolder={onToggleFolder}
              onCopy={onCopy}
              onPaste={onPaste}
              onMove={onMove}
              clipboardFile={clipboardFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({
  files,
  activeFileId,
  onFileClick,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onToggleFolder,
  onCopy,
  onPaste,
  onMove,
  className = ''
}: FileTreeProps) {
  // console.log('FileTree render - files:', files);
  // console.log('FileTree render - files count:', files.length);
  
  const [clipboardFile, setClipboardFile] = useState<string | undefined>();

  const handleCopy = (fileId: string) => {
    setClipboardFile(fileId);
    onCopy(fileId);
  };

  const handlePaste = (parentId?: string) => {
    onPaste(parentId);
    setClipboardFile(undefined); // Clear clipboard after paste
  };
  
  return (
    <div className={`text-sm ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-800">
        <span className="text-gray-400 text-xs uppercase tracking-wider">Explorer</span>
        <div className="flex gap-1">
          <button
            onClick={() => onCreateFile()}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            title="New File"
          >
            <FileText className="w-3 h-3" />
          </button>
          <button
            onClick={() => onCreateFolder()}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            title="New Folder"
          >
            <Folder className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="py-2">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            level={0}
            activeFileId={activeFileId}
            onFileClick={onFileClick}
            onCreateFile={onCreateFile}
            onCreateFolder={onCreateFolder}
            onRename={onRename}
            onDelete={onDelete}
            onToggleFolder={onToggleFolder}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onMove={onMove}
            clipboardFile={clipboardFile}
          />
        ))}
      </div>
    </div>
  );
}