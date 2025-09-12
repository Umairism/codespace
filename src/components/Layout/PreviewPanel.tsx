import React, { useState } from 'react';
import { Eye, Globe, Smartphone, Monitor } from 'lucide-react';
import { FileNode } from '../../types';
import { findFileById, getLanguageFromExtension, getFileExtension } from '../../utils/fileUtils';

interface PreviewPanelProps {
  files: FileNode[];
  activeFileId?: string;
  width: number;
  className?: string;
}

type ViewportType = 'desktop' | 'tablet' | 'mobile';

export function PreviewPanel({
  files,
  activeFileId,
  width,
  className = ''
}: PreviewPanelProps) {
  const [viewport, setViewport] = useState<ViewportType>('desktop');
  
  const activeFile = activeFileId ? findFileById(files, activeFileId) : null;
  const language = activeFile ? getLanguageFromExtension(getFileExtension(activeFile.name)) : null;

  const viewportSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  const viewportIcons = {
    desktop: Monitor,
    tablet: Monitor,
    mobile: Smartphone
  };

  const renderPreview = () => {
    if (!activeFile || !activeFile.content) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>No preview available</p>
            <p className="text-sm mt-2">Open a file to see preview</p>
          </div>
        </div>
      );
    }

    if (language === 'html' || language === 'javascript') {
      return (
        <iframe
          srcDoc={activeFile.content}
          className="w-full h-full border-0 bg-white"
          title="Preview"
        />
      );
    }

    if (language === 'markdown') {
      return (
        <div className="h-full p-4 bg-white overflow-auto">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm">{activeFile.content}</pre>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full p-4 bg-gray-900 overflow-auto">
        <div className="text-gray-300 text-sm">
          <div className="mb-4 pb-2 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{activeFile.name}</span>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                {language || 'text'}
              </span>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-xs leading-relaxed">
            {activeFile.content}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`bg-gray-800 border-l border-gray-700 flex flex-col ${className}`}
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Preview</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {Object.entries(viewportIcons).map(([key, Icon]) => (
            <button
              key={key}
              onClick={() => setViewport(key as ViewportType)}
              className={`p-1 rounded text-xs ${
                viewport === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={`${key} view`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 bg-gray-100">
        <div 
          className="mx-auto bg-white shadow-lg"
          style={{
            width: viewportSizes[viewport].width,
            height: viewportSizes[viewport].height,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}