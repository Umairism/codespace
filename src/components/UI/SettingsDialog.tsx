import { useState } from 'react';
import { X, Settings } from 'lucide-react';

interface Settings {
  theme: string;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  autoSave: boolean;
  minimap: boolean;
}

interface SettingsDialogProps {
  visible: boolean;
  onClose: () => void;
  onSaveSettings: (settings: Settings) => void;
  currentSettings?: Settings;
}

export function SettingsDialog({ visible, onClose, onSaveSettings, currentSettings }: SettingsDialogProps) {
  const [theme, setTheme] = useState(currentSettings?.theme || 'dark');
  const [fontSize, setFontSize] = useState(currentSettings?.fontSize || 14);
  const [tabSize, setTabSize] = useState(currentSettings?.tabSize || 2);
  const [wordWrap, setWordWrap] = useState(currentSettings?.wordWrap || true);
  const [autoSave, setAutoSave] = useState(currentSettings?.autoSave || true);
  const [minimap, setMinimap] = useState(currentSettings?.minimap || false);

  if (!visible) return null;

  const handleSave = () => {
    const settings: Settings = {
      theme,
      fontSize,
      tabSize,
      wordWrap,
      autoSave,
      minimap
    };
    onSaveSettings(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Settings className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h4 className="text-white font-medium mb-3">Appearance</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="high-contrast">High Contrast</option>
                </select>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div>
            <h4 className="text-white font-medium mb-3">Editor</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 mt-1">{fontSize}px</div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Tab Size</label>
                <select
                  value={tabSize}
                  onChange={(e) => setTabSize(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>

              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={wordWrap}
                  onChange={(e) => setWordWrap(e.target.checked)}
                  className="mr-2"
                />
                Word wrap
              </label>

              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={minimap}
                  onChange={(e) => setMinimap(e.target.checked)}
                  className="mr-2"
                />
                Show minimap
              </label>
            </div>
          </div>

          {/* Files */}
          <div>
            <h4 className="text-white font-medium mb-3">Files</h4>
            <div className="space-y-3">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="mr-2"
                />
                Auto save
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
