import { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { FileNode } from '../../types';
import { getLanguageFromExtension, getFileExtension } from '../../utils/fileUtils';
import { useMonacoEditor } from '../../contexts/MonacoEditorContext';

interface Settings {
  theme: string;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  autoSave: boolean;
  minimap: boolean;
}

interface CodeEditorProps {
  file: FileNode;
  onChange: (content: string) => void;
  settings?: Settings;
  className?: string;
}

export function CodeEditor({ file, onChange, settings, className = '' }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const { setEditor } = useMonacoEditor();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setEditor(editor);
    
    // Configure editor theme
    monaco.editor.defineTheme('vs-dark-custom', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'tag', foreground: '4FC1FF' },
        { token: 'attribute.name', foreground: '92C5F8' },
        { token: 'attribute.value', foreground: 'CE9178' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264f78',
        'editor.lineHighlightBackground': '#2a2d2e',
      }
    });
    
    const themeName = settings?.theme === 'light' ? 'vs' : 'vs-dark-custom';
    monaco.editor.setTheme(themeName);

    // Enhanced editor configuration for web development
    monaco.editor.setModelLanguage(editor.getModel()!, language);
    
    // Enable better IntelliSense for HTML, CSS, and JavaScript
    if (language === 'html') {
      editor.updateOptions({
        suggest: {
          showWords: true,
          showSnippets: true,
        },
      });
    }
    
    if (language === 'css') {
      editor.updateOptions({
        suggest: {
          showWords: true,
          showSnippets: true,
        },
      });
    }
    
    if (language === 'javascript') {
      editor.updateOptions({
        suggest: {
          showWords: true,
          showSnippets: true,
        },
      });
    }

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save shortcut - content is already being saved via onChange
      console.log('File saved');
    });
  };

  const language = file.language || getLanguageFromExtension(getFileExtension(file.name));

  return (
    <div className={`h-full w-full overflow-hidden ${className}`}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={file.content || ''}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: settings?.minimap ?? true },
          fontSize: settings?.fontSize ?? 14,
          lineNumbers: 'on',
          rulers: [80, 120],
          wordWrap: settings?.wordWrap ? 'on' : 'off',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          tabSize: settings?.tabSize ?? 2,
          insertSpaces: true,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          },
          // Ensure proper scrolling
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            alwaysConsumeMouseWheel: false
          },
          // Prevent editor from expanding beyond container
          fixedOverflowWidgets: true
        }}
      />
    </div>
  );
}