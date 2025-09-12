import React from 'react';
import { FileTree } from '../Editor/FileTree';
import { FileNode } from '../../types';

interface SidebarProps {
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
  width: number;
  className?: string;
}

export function Sidebar({
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
  width,
  className = ''
}: SidebarProps) {
  // console.log('Sidebar render - files:', files);
  // console.log('Sidebar render - files count:', files.length);
  
  return (
    <div 
      className={`bg-gray-900 border-r border-gray-700 ${className}`}
      style={{ width: `${width}px` }}
    >
      <FileTree
        files={files}
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
        className="h-full"
      />
    </div>
  );
}