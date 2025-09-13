import { useState } from 'react';
import { Play, Square, Trash2, Terminal, Bug, FileText } from 'lucide-react';
import { ExecutionResult } from '../../types';
import { Button } from '../UI/Button';

interface OutputPanelProps {
  output: ExecutionResult[];
  isExecuting: boolean;
  onRun: () => void;
  onClear: () => void;
  height: number;
  className?: string;
}

type TabType = 'terminal' | 'output' | 'debug';

export function OutputPanel({
  output,
  isExecuting,
  onRun,
  onClear,
  height,
  className = ''
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('terminal');

  const tabs = [
    { id: 'terminal' as TabType, label: 'Terminal', icon: Terminal },
    { id: 'output' as TabType, label: 'Output', icon: FileText },
    { id: 'debug' as TabType, label: 'Debug', icon: Bug }
  ];

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getOutputTypeColor = (type: ExecutionResult['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div 
      className={`bg-gray-900 border-t border-gray-700 ${className}`}
      style={{ height: `${height}px` }}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-1 text-sm rounded-t ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white border-t-2 border-t-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={onRun}
            variant="primary"
            size="sm"
            icon={isExecuting ? Square : Play}
            disabled={isExecuting}
          >
            {isExecuting ? 'Running...' : 'Run'}
          </Button>
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
            icon={Trash2}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="h-full overflow-auto p-4">
        {activeTab === 'terminal' && (
          <div className="font-mono text-sm">
            {output.length === 0 ? (
              <div className="text-gray-500">
                <p>Terminal ready</p>
                <p>Click "Run" to execute the active file</p>
              </div>
            ) : (
              <div className="space-y-2">
                {output.map((result, index) => (
                  <div key={index} className="border-l-2 border-gray-700 pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${getOutputTypeColor(result.type)}`}>
                        {result.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(result.timestamp)}
                      </span>
                    </div>
                    <div className="text-gray-300">
                      {result.output.split('\n').map((line, lineIndex) => (
                        <div key={lineIndex} className={`${
                          line.includes('❌') ? 'text-red-400' :
                          line.includes('⚠️') ? 'text-yellow-400' :
                          line.includes('✅') ? 'text-green-400' :
                          line.includes('🔍') ? 'text-blue-400' :
                          line.includes('💡') ? 'text-cyan-400' :
                          line.includes('🚀') || line.includes('🐍') ? 'text-purple-400' :
                          line.includes('📝') || line.includes('📅') ? 'text-gray-400' :
                          'text-gray-300'
                        }`}>
                          {line || '\u00A0'}
                        </div>
                      ))}
                    </div>
                    {result.error && (
                      <div className="mt-2 p-2 bg-red-900/20 border border-red-700 rounded">
                        <pre className="text-red-300 whitespace-pre-wrap text-sm">
                          {result.error}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'output' && (
          <div className="font-mono text-sm text-gray-300">
            <p>Output panel - execution results will appear here</p>
            {output.filter(r => r.type === 'success').map((result, index) => (
              <pre key={index} className="mt-2 whitespace-pre-wrap">
                {result.output}
              </pre>
            ))}
          </div>
        )}

        {activeTab === 'debug' && (
          <div className="font-mono text-sm">
            {output.filter(r => r.type === 'error' || r.output.includes('❌') || r.output.includes('🔍')).length === 0 ? (
              <div className="text-gray-500">
                <p>🔍 Debug panel - Error analysis and diagnostics will appear here</p>
                <p>💡 Run code to see syntax checks and error details</p>
              </div>
            ) : (
              <div className="space-y-3">
                {output.filter(r => r.type === 'error' || r.output.includes('❌') || r.output.includes('🔍')).map((result, index) => (
                  <div key={index} className="border border-red-700/30 rounded-lg p-3 bg-red-900/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-400 font-semibold text-xs">
                        🐛 DEBUG INFO
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(result.timestamp)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {result.output.split('\n').map((line, lineIndex) => {
                        if (line.includes('🔍')) {
                          return (
                            <div key={lineIndex} className="text-blue-400 font-medium text-sm">
                              {line}
                            </div>
                          );
                        }
                        if (line.includes('❌')) {
                          return (
                            <div key={lineIndex} className="text-red-400 text-sm">
                              {line}
                            </div>
                          );
                        }
                        if (line.includes('💡')) {
                          return (
                            <div key={lineIndex} className="text-cyan-400 text-sm italic">
                              {line}
                            </div>
                          );
                        }
                        if (line.includes('🔴')) {
                          return (
                            <div key={lineIndex} className="text-red-300 text-sm font-medium">
                              {line}
                            </div>
                          );
                        }
                        if (line.trim()) {
                          return (
                            <div key={lineIndex} className="text-gray-300 text-sm">
                              {line}
                            </div>
                          );
                        }
                        return <div key={lineIndex} className="h-1"></div>;
                      })}
                    </div>
                    
                    {result.error && (
                      <div className="mt-2 p-2 bg-red-900/30 border border-red-600 rounded text-red-200 text-sm">
                        <strong>Stack Trace:</strong>
                        <pre className="whitespace-pre-wrap mt-1">{result.error}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}