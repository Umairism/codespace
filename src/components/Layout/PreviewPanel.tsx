import { useState } from 'react';
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

  const buildFullPreview = () => {
    // Find HTML file first
    const htmlFile = files.find(f => f.name.toLowerCase().endsWith('.html'));
    if (!htmlFile || !htmlFile.content) return null;

    let htmlContent = htmlFile.content;

    // Find and inject CSS files
    const cssFiles = files.filter(f => f.name.toLowerCase().endsWith('.css') && f.content);
    cssFiles.forEach(cssFile => {
      const cssLink = `<link rel="stylesheet" href="${cssFile.name}">`;
      const cssInject = `<style>/* ${cssFile.name} */\n${cssFile.content}\n</style>`;
      
      if (htmlContent.includes(cssLink)) {
        htmlContent = htmlContent.replace(cssLink, cssInject);
      } else {
        // Inject before closing head tag
        htmlContent = htmlContent.replace('</head>', `${cssInject}\n</head>`);
      }
    });

    // Find and inject JavaScript files
    const jsFiles = files.filter(f => f.name.toLowerCase().endsWith('.js') && f.content);
    const jsxFiles = files.filter(f => f.name.toLowerCase().endsWith('.jsx') && f.content);
    
    // Handle regular JS files
    jsFiles.forEach(jsFile => {
      const jsScript = `<script src="${jsFile.name}"></script>`;
      const jsInject = `<script>/* ${jsFile.name} */\n${jsFile.content}\n</script>`;
      
      if (htmlContent.includes(jsScript)) {
        htmlContent = htmlContent.replace(jsScript, jsInject);
      } else {
        // Inject before closing body tag
        htmlContent = htmlContent.replace('</body>', `${jsInject}\n</body>`);
      }
    });

    // Handle JSX files with Babel transpilation
    jsxFiles.forEach(jsxFile => {
      const jsxScript = `<script src="${jsxFile.name}"></script>`;
      // Check if the JSX file already has a render call
      const hasRenderCall = jsxFile.content?.includes('ReactDOM.render') || jsxFile.content?.includes('ReactDOM.createRoot') || false;
      const renderCode = hasRenderCall ? '' : '\n\n// Auto-render the main component\nif (typeof App !== "undefined") {\n  ReactDOM.render(<App />, document.getElementById("root"));\n}';
      const jsxInject = `<script type="text/babel">/* ${jsxFile.name} */\n${jsxFile.content}${renderCode}\n</script>`;
      
      if (htmlContent.includes(jsxScript)) {
        htmlContent = htmlContent.replace(jsxScript, jsxInject);
      } else {
        // Inject before closing body tag
        htmlContent = htmlContent.replace('</body>', `${jsxInject}\n</body>`);
      }
    });

    return htmlContent;
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

    // For HTML files, try to build a complete preview with CSS and JS
    if (language === 'html') {
      const fullPreview = buildFullPreview();
      if (fullPreview) {
        return (
          <iframe
            srcDoc={fullPreview}
            className="w-full h-full border-0 bg-white"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        );
      }
      
      return (
        <iframe
          srcDoc={activeFile.content}
          className="w-full h-full border-0 bg-white"
          title="HTML Preview"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      );
    }

    // For CSS files, show a styled preview
    if (language === 'css') {
      const cssPreviewHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>CSS Preview</title>
          <style>${activeFile.content}</style>
        </head>
        <body>
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1>CSS Preview</h1>
            <p>This is a preview of your CSS styles applied to sample HTML elements.</p>
            
            <h2>Typography</h2>
            <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
            <p><a href="#">This is a link</a></p>
            
            <h3>Lists</h3>
            <ul>
              <li>Unordered list item 1</li>
              <li>Unordered list item 2</li>
              <li>Unordered list item 3</li>
            </ul>
            
            <ol>
              <li>Ordered list item 1</li>
              <li>Ordered list item 2</li>
              <li>Ordered list item 3</li>
            </ol>
            
            <h3>Form Elements</h3>
            <form>
              <input type="text" placeholder="Text input" style="margin: 5px;"><br>
              <button type="button" style="margin: 5px;">Button</button><br>
              <select style="margin: 5px;">
                <option>Select option</option>
              </select>
            </form>
            
            <h3>Sample Divs</h3>
            <div class="sample-div" style="background: #f0f0f0; padding: 10px; margin: 10px 0; border: 1px solid #ddd;">
              Sample div with class "sample-div"
            </div>
            <div id="sample-id" style="background: #e0e0e0; padding: 10px; margin: 10px 0; border: 1px solid #ccc;">
              Sample div with id "sample-id"
            </div>
          </div>
        </body>
        </html>
      `;
      
      return (
        <iframe
          srcDoc={cssPreviewHtml}
          className="w-full h-full border-0 bg-white"
          title="CSS Preview"
        />
      );
    }

    // For JavaScript files, show in a test environment
    if (language === 'javascript') {
      // Check if this is a JSX file in a React project
      const isJSXFile = activeFile.name.toLowerCase().endsWith('.jsx');
      const htmlFile = files.find(f => f.name.toLowerCase().endsWith('.html'));
      const hasReactDeps = htmlFile?.content?.includes('react') || false;
      
      if (isJSXFile && hasReactDeps) {
        // For JSX files in React projects, show the HTML preview with React components
        const fullPreview = buildFullPreview();
        if (fullPreview) {
          return (
            <iframe
              srcDoc={fullPreview}
              className="w-full h-full border-0 bg-white"
              title="React Component Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          );
        }
        
        // Fallback JSX info if no HTML file
        const jsxInfoHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>JSX Component</title>
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                padding: 20px; 
                background: #f5f5f5;
                margin: 0;
              }
              .info-card { 
                background: white; 
                border-radius: 8px; 
                padding: 20px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 600px;
                margin: 0 auto;
              }
              h1 { color: #61dafb; margin-top: 0; }
              .code { 
                background: #f8f8f8; 
                border: 1px solid #e1e1e1; 
                border-radius: 4px; 
                padding: 15px; 
                font-family: 'Consolas', monospace;
                white-space: pre-wrap;
                overflow: auto;
                max-height: 300px;
              }
            </style>
          </head>
          <body>
            <div class="info-card">
              <h1>⚛️ React Component</h1>
              <p>This is a JSX React component. To see it rendered, view the HTML file in your project.</p>
              <p><strong>Component code:</strong></p>
              <div class="code">${activeFile.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>
          </body>
          </html>`;
          
        return (
          <iframe
            srcDoc={jsxInfoHtml}
            className="w-full h-full border-0 bg-gray-100"
            title="JSX Component Info"
            sandbox="allow-scripts allow-same-origin"
          />
        );
      }
      
      // Regular JavaScript preview
      const jsPreviewHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>JavaScript Preview</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              background: #f5f5f5; 
            }
            .console { 
              background: #1e1e1e; 
              color: #00ff00; 
              padding: 15px; 
              border-radius: 5px; 
              font-family: 'Courier New', monospace; 
              margin-top: 20px;
              min-height: 200px;
              overflow-y: auto;
            }
            .console-line { 
              margin-bottom: 5px; 
            }
            .error { color: #ff6b6b !important; }
            .info { color: #4ecdc4 !important; }
            .warn { color: #ffe66d !important; }
          </style>
        </head>
        <body>
          <h1>JavaScript Preview</h1>
          <p>Console output will appear below:</p>
          <div class="console" id="console"></div>
          
          <script>
            // Override console methods to display in preview
            const consoleDiv = document.getElementById('console');
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            
            function addToConsole(message, type = 'log') {
              const line = document.createElement('div');
              line.className = 'console-line ' + type;
              line.textContent = '> ' + message;
              consoleDiv.appendChild(line);
              consoleDiv.scrollTop = consoleDiv.scrollHeight;
            }
            
            console.log = (...args) => {
              originalLog(...args);
              addToConsole(args.join(' '), 'log');
            };
            
            console.error = (...args) => {
              originalError(...args);
              addToConsole('ERROR: ' + args.join(' '), 'error');
            };
            
            console.warn = (...args) => {
              originalWarn(...args);
              addToConsole('WARN: ' + args.join(' '), 'warn');
            };
            
            console.info = (...args) => {
              originalInfo(...args);
              addToConsole('INFO: ' + args.join(' '), 'info');
            };
            
            // Add initial message
            addToConsole('JavaScript preview initialized', 'info');
            
            try {
              ${activeFile.content}
            } catch (error) {
              console.error(error.message);
            }
          </script>
        </body>
        </html>
      `;
      
      return (
        <iframe
          srcDoc={jsPreviewHtml}
          className="w-full h-full border-0 bg-white"
          title="JavaScript Preview"
          sandbox="allow-scripts"
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