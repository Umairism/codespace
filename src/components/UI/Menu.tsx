import React, { useState } from 'react';
import { 
  ChevronDown, 
  FileText, 
  FolderPlus, 
  Play, 
  Save, 
  Settings, 
  Undo, 
  Redo, 
  Search, 
  Replace, 
  Eye, 
  EyeOff,
  Terminal,
  Sidebar
} from 'lucide-react';

interface MenuProps {
  onNewFile: () => void;
  onNewFolder: () => void;
  onSave: () => void;
  onSaveAll: () => void;
  onSettings: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFind: () => void;
  onReplace: () => void;
  onFindInFiles: () => void;
  onRun: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  onTogglePreview: () => void;
}

interface MenuItemProps {
  label: string;
  shortcut?: string;
  icon?: React.ComponentType<any>;
  onClick?: () => void;
  disabled?: boolean;
}

function MenuItem({ label, shortcut, icon: Icon, onClick, disabled }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-3" />}
        {label}
      </div>
      {shortcut && (
        <span className="text-xs text-gray-500">{shortcut}</span>
      )}
    </button>
  );
}

function MenuDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        {label}
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full z-20 w-48 bg-gray-800 border border-gray-700 shadow-lg">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export function Menu({ 
  onNewFile, 
  onNewFolder, 
  onSave, 
  onSaveAll,
  onSettings,
  onUndo,
  onRedo,
  onFind,
  onReplace,
  onFindInFiles,
  onRun,
  onToggleSidebar,
  onToggleTerminal,
  onTogglePreview
}: MenuProps) {
  return (
    <div className="flex items-center bg-gray-800 border-b border-gray-700 px-2">
      <MenuDropdown label="File">
        <MenuItem label="New File" shortcut="Ctrl+N" icon={FileText} onClick={onNewFile} />
        <MenuItem label="New Folder" icon={FolderPlus} onClick={onNewFolder} />
        <div className="border-t border-gray-700 my-1" />
        <MenuItem label="Save" shortcut="Ctrl+S" icon={Save} onClick={onSave} />
        <MenuItem label="Save All" shortcut="Ctrl+Shift+S" icon={Save} onClick={onSaveAll} />
        <div className="border-t border-gray-700 my-1" />
        <MenuItem label="Settings" icon={Settings} onClick={onSettings} />
      </MenuDropdown>
      
      <MenuDropdown label="Edit">
        <MenuItem label="Undo" shortcut="Ctrl+Z" icon={Undo} onClick={onUndo} />
        <MenuItem label="Redo" shortcut="Ctrl+Y" icon={Redo} onClick={onRedo} />
        <div className="border-t border-gray-700 my-1" />
        <MenuItem label="Find" shortcut="Ctrl+F" icon={Search} onClick={onFind} />
        <MenuItem label="Replace" shortcut="Ctrl+H" icon={Replace} onClick={onReplace} />
        <MenuItem label="Find in Files" shortcut="Ctrl+Shift+F" icon={Search} onClick={onFindInFiles} />
      </MenuDropdown>
      
      <MenuDropdown label="Run">
        <MenuItem label="Run Code" shortcut="Ctrl+R" icon={Play} onClick={onRun} />
        <MenuItem label="Run File" shortcut="F5" icon={Play} onClick={onRun} />
      </MenuDropdown>
      
      <MenuDropdown label="View">
        <MenuItem label="Toggle Sidebar" shortcut="Ctrl+B" icon={Sidebar} onClick={onToggleSidebar} />
        <MenuItem label="Toggle Terminal" shortcut="Ctrl+`" icon={Terminal} onClick={onToggleTerminal} />
        <MenuItem label="Toggle Preview" shortcut="Ctrl+Shift+V" icon={Eye} onClick={onTogglePreview} />
      </MenuDropdown>
    </div>
  );
}