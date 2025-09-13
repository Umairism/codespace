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
    
    // Configure enhanced theme with better syntax highlighting
    monaco.editor.defineTheme('vs-dark-custom', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'tag', foreground: '4FC1FF' },
        { token: 'attribute.name', foreground: '92C5F8' },
        { token: 'attribute.value', foreground: 'CE9178' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264f78',
        'editor.lineHighlightBackground': '#2a2d2e',
        'editorError.foreground': '#f44747',
        'editorWarning.foreground': '#ff8c00',
        'editorInfo.foreground': '#75beff',
      }
    });
    
    const themeName = settings?.theme === 'light' ? 'vs' : 'vs-dark-custom';
    monaco.editor.setTheme(themeName);

    // Set language for the model
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
    
    // Configure global Monaco settings for better IntelliSense
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      strict: true,
      typeRoots: ['node_modules/@types']
    });

    // Enable diagnostics and better error reporting
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false
    });

    // Add common library definitions
    const reactTypes = `
      declare module 'react' {
        export interface FC<P = {}> {
          (props: P & { children?: ReactNode }): ReactElement | null;
        }
        export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
          type: T;
          props: P;
          key: Key | null;
        }
        export type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
        export type Key = string | number;
        export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
        export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
        export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
        export type Dispatch<A> = (value: A) => void;
        export type SetStateAction<S> = S | ((prevState: S) => S);
      }
    `;

    // Add type definitions for common libraries
    if (language === 'typescript' || language === 'javascript') {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(reactTypes, 'file:///node_modules/@types/react/index.d.ts');
      monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, 'file:///node_modules/@types/react/index.d.ts');
    }

    // Enhanced IntelliSense configuration per language
    switch (language) {
      case 'html':
        editor.updateOptions({
          suggest: {
            showWords: true,
            showSnippets: true,
            showConstructors: true,
            showFunctions: true,
            showVariables: true,
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          }
        });
        break;

      case 'css':
        editor.updateOptions({
          suggest: {
            showWords: true,
            showSnippets: true,
            showProperties: true,
            showValues: true,
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          }
        });
        break;

      case 'javascript':
      case 'typescript':
        editor.updateOptions({
          suggest: {
            showWords: true,
            showSnippets: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showModules: true,
            showProperties: true,
            showMethods: true,
            showKeywords: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          },
          parameterHints: {
            enabled: true
          },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true
        });
        break;

      case 'python':
        editor.updateOptions({
          suggest: {
            showWords: true,
            showSnippets: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showModules: true,
            showKeywords: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          }
        });
        break;

      default:
        editor.updateOptions({
          suggest: {
            showWords: true,
            showSnippets: true,
          }
        });
    }

    // Real-time error detection and markers
    const updateErrorMarkers = () => {
      const model = editor.getModel();
      if (!model) return;

      // Custom syntax validation for different languages
      const content = model.getValue();
      const customMarkers: any[] = [];

      if (language === 'javascript' || language === 'typescript') {
        // Check for common JS/TS errors
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          // Check for missing semicolons (basic check)
          if (line.trim().match(/^(let|const|var)\s+\w+\s*=.*[^;]$/)) {
            customMarkers.push({
              severity: monaco.MarkerSeverity.Warning,
              startLineNumber: index + 1,
              startColumn: line.length,
              endLineNumber: index + 1,
              endColumn: line.length + 1,
              message: 'Consider adding a semicolon'
            });
          }

          // Check for undefined variables (basic check)
          const undefinedMatch = line.match(/console\.log\((\w+)\)/);
          if (undefinedMatch && !content.includes(`${undefinedMatch[1]} =`)) {
            customMarkers.push({
              severity: monaco.MarkerSeverity.Info,
              startLineNumber: index + 1,
              startColumn: line.indexOf(undefinedMatch[1]) + 1,
              endLineNumber: index + 1,
              endColumn: line.indexOf(undefinedMatch[1]) + undefinedMatch[1].length + 1,
              message: `Variable '${undefinedMatch[1]}' might not be defined`
            });
          }
        });
      }

      if (language === 'python') {
        // Basic Python syntax checks
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          // Check for basic indentation issues
          if (line.match(/^\s*(if|for|while|def|class).*[^:]$/)) {
            customMarkers.push({
              severity: monaco.MarkerSeverity.Error,
              startLineNumber: index + 1,
              startColumn: line.length,
              endLineNumber: index + 1,
              endColumn: line.length + 1,
              message: 'Missing colon at end of statement'
            });
          }
        });
      }

      // Set all markers (including TypeScript compiler errors + custom ones)
      monaco.editor.setModelMarkers(model, 'customLinter', customMarkers);
    };

    // Update markers on content change
    model?.onDidChangeContent(() => {
      setTimeout(updateErrorMarkers, 500); // Debounce
    });

    // Initial marker update
    setTimeout(updateErrorMarkers, 1000);

    // Add enhanced keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('File saved');
    });

    // Format document shortcut
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });

    // Quick fix shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Period, () => {
      editor.getAction('editor.action.quickFix')?.run();
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