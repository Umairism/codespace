import { createContext, useContext } from 'react';
import type * as monaco from 'monaco-editor';

interface MonacoEditorContextType {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  setEditor: (editor: monaco.editor.IStandaloneCodeEditor | null) => void;
}

export const MonacoEditorContext = createContext<MonacoEditorContextType>({
  editor: null,
  setEditor: () => {},
});

export const useMonacoEditor = () => {
  return useContext(MonacoEditorContext);
};
