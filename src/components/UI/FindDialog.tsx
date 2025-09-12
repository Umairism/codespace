import { useState } from 'react';
import { X, Search, Replace } from 'lucide-react';

interface FindDialogProps {
  visible: boolean;
  onClose: () => void;
  mode: 'find' | 'replace' | 'findInFiles';
  onFind?: (text: string, options: { caseSensitive: boolean; wholeWord: boolean; useRegex: boolean }) => void;
  onReplace?: (findText: string, replaceText: string, options: { caseSensitive: boolean; wholeWord: boolean; useRegex: boolean }) => void;
  onReplaceAll?: (findText: string, replaceText: string, options: { caseSensitive: boolean; wholeWord: boolean; useRegex: boolean }) => void;
}

export function FindDialog({ visible, onClose, mode, onFind, onReplace, onReplaceAll }: FindDialogProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  if (!visible) return null;

  const handleFind = () => {
    if (findText.trim() && onFind) {
      onFind(findText, { caseSensitive, wholeWord, useRegex });
    }
  };

  const handleReplace = () => {
    if (findText.trim() && onReplace) {
      onReplace(findText, replaceText, { caseSensitive, wholeWord, useRegex });
    }
  };

  const handleReplaceAll = () => {
    if (findText.trim() && onReplaceAll) {
      onReplaceAll(findText, replaceText, { caseSensitive, wholeWord, useRegex });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'find': return 'Find';
      case 'replace': return 'Find and Replace';
      case 'findInFiles': return 'Find in Files';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{getTitle()}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Find:</label>
            <div className="relative">
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white pr-10"
                placeholder="Enter search term..."
                autoFocus
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {(mode === 'replace') && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Replace:</label>
              <div className="relative">
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white pr-10"
                  placeholder="Enter replacement..."
                />
                <Replace className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="mr-2"
              />
              Case sensitive
            </label>
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="mr-2"
              />
              Whole word
            </label>
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="mr-2"
              />
              Regular expression
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            {mode === 'replace' ? (
              <>
                <button
                  onClick={handleFind}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Find Next
                </button>
                <button
                  onClick={handleReplace}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm"
                >
                  Replace
                </button>
                <button
                  onClick={handleReplaceAll}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                  Replace All
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleFind}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {mode === 'findInFiles' ? 'Search Files' : 'Find Next'}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
