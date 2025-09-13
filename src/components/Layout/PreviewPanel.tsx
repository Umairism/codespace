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
      // VS Code-style Markdown preview with comprehensive parser
      const markdownPreviewHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Markdown Preview</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            /* VS Code Markdown Preview Styles */
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif;
              font-size: 14px;
              padding: 0 26px;
              line-height: 22px;
              word-wrap: break-word;
              background-color: #ffffff;
              color: #333333;
              margin: 0;
              box-sizing: border-box;
            }

            /* Headers */
            h1, h2, h3, h4, h5, h6 {
              font-weight: 600;
              margin-top: 24px;
              margin-bottom: 16px;
              line-height: 1.25;
              color: #24292f;
            }

            h1 {
              font-size: 2em;
              margin-top: 0;
              margin-bottom: 16px;
              border-bottom: 1px solid #eaecef;
              padding-bottom: 0.3em;
            }

            h2 {
              font-size: 1.5em;
              border-bottom: 1px solid #eaecef;
              padding-bottom: 0.3em;
            }

            h3 { font-size: 1.25em; }
            h4 { font-size: 1em; }
            h5 { font-size: 0.875em; }
            h6 { font-size: 0.85em; color: #6a737d; }

            /* Paragraphs */
            p {
              margin-top: 0;
              margin-bottom: 16px;
            }

            /* Lists */
            ul, ol {
              padding-left: 2em;
              margin-top: 0;
              margin-bottom: 16px;
            }

            li {
              margin-bottom: 0.25em;
            }

            li > p {
              margin-top: 16px;
            }

            li + li {
              margin-top: 0.25em;
            }

            /* Blockquotes */
            blockquote {
              margin: 0 0 16px 0;
              padding: 0 1em;
              color: #6a737d;
              border-left: 0.25em solid #dfe2e5;
            }

            blockquote > :first-child {
              margin-top: 0;
            }

            blockquote > :last-child {
              margin-bottom: 0;
            }

            /* Code */
            code {
              background-color: rgba(175, 184, 193, 0.2);
              padding: 0.2em 0.4em;
              border-radius: 6px;
              font-size: 85%;
              font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            }

            pre {
              background-color: #f6f8fa;
              border-radius: 6px;
              font-size: 85%;
              line-height: 1.45;
              overflow: auto;
              padding: 16px;
              margin-bottom: 16px;
            }

            pre code {
              background-color: transparent;
              border: 0;
              display: inline;
              line-height: inherit;
              margin: 0;
              max-width: auto;
              padding: 0;
              word-wrap: normal;
            }

            /* Tables */
            table {
              border-collapse: collapse;
              border-spacing: 0;
              width: 100%;
              overflow: auto;
              margin-bottom: 16px;
            }

            table th,
            table td {
              padding: 6px 13px;
              border: 1px solid #dfe2e5;
            }

            table th {
              font-weight: 600;
              background-color: #f6f8fa;
            }

            table tr {
              background-color: #fff;
              border-top: 1px solid #c6cbd1;
            }

            table tr:nth-child(2n) {
              background-color: #f6f8fa;
            }

            /* Horizontal Rule */
            hr {
              border: 0;
              border-top: 1px solid #eee;
              height: 0.25em;
              margin: 24px 0;
              background-color: transparent;
            }

            /* Links */
            a {
              color: #0366d6;
              text-decoration: none;
            }

            a:hover {
              text-decoration: underline;
            }

            /* Images */
            img {
              max-width: 100%;
              height: auto;
              box-sizing: content-box;
            }

            /* Task Lists */
            .task-list-item {
              list-style-type: none;
            }

            .task-list-item-checkbox {
              margin: 0 0.2em 0.25em -1.6em;
              vertical-align: middle;
            }

            /* Syntax Highlighting for Code Blocks */
            .hljs {
              display: block;
              overflow-x: auto;
              padding: 0.5em;
              background: #f6f8fa;
            }

            .hljs-comment,
            .hljs-quote {
              color: #6a737d;
              font-style: italic;
            }

            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-subst {
              color: #d73a49;
            }

            .hljs-number,
            .hljs-literal,
            .hljs-variable,
            .hljs-template-variable,
            .hljs-tag .hljs-attr {
              color: #005cc5;
            }

            .hljs-string,
            .hljs-doctag {
              color: #032f62;
            }

            .hljs-title,
            .hljs-section,
            .hljs-selector-id {
              color: #6f42c1;
              font-weight: bold;
            }

            .hljs-type,
            .hljs-class .hljs-title {
              color: #d73a49;
            }
          </style>
        </head>
        <body>
          <div id="markdown-content"></div>
          
          <script>
            // Comprehensive Markdown to HTML parser (VS Code style)
            function parseMarkdown(markdown) {
              let html = markdown;
              
              // Escape HTML entities first
              html = html
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
              
              // Code blocks (must be before inline code)
              html = html.replace(/\`\`\`([^\\n]*)\\n([\\s\\S]*?)\`\`\`/g, (match, lang, code) => {
                const language = lang.trim() || 'plaintext';
                return \`<pre><code class="hljs language-\${language}">\${code.trim()}</code></pre>\`;
              });
              
              // Inline code
              html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
              
              // Headers (with proper line boundary matching)
              html = html.replace(/^#{6}\\s+(.+)$/gm, '<h6>$1</h6>');
              html = html.replace(/^#{5}\\s+(.+)$/gm, '<h5>$1</h5>');
              html = html.replace(/^#{4}\\s+(.+)$/gm, '<h4>$1</h4>');
              html = html.replace(/^#{3}\\s+(.+)$/gm, '<h3>$1</h3>');
              html = html.replace(/^#{2}\\s+(.+)$/gm, '<h2>$1</h2>');
              html = html.replace(/^#{1}\\s+(.+)$/gm, '<h1>$1</h1>');
              
              // Bold and Italic
              html = html.replace(/\\*\\*\\*([^\\*]+)\\*\\*\\*/g, '<strong><em>$1</em></strong>');
              html = html.replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong>$1</strong>');
              html = html.replace(/\\*([^\\*]+)\\*/g, '<em>$1</em>');
              html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
              html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
              
              // Strikethrough
              html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
              
              // Links
              html = html.replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/g, '<a href="$2">$1</a>');
              
              // Images
              html = html.replace(/!\\[([^\\]]*)\\]\\(([^\\)]+)\\)/g, '<img src="$2" alt="$1" />');
              
              // Horizontal rules
              html = html.replace(/^---+$/gm, '<hr>');
              html = html.replace(/^\\*\\*\\*+$/gm, '<hr>');
              
              // Blockquotes
              html = html.replace(/^>\\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
              
              // Task lists
              html = html.replace(/^\\s*-\\s+\\[x\\]\\s+(.+)$/gm, '<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" checked disabled> $1</li>');
              html = html.replace(/^\\s*-\\s+\\[ \\]\\s+(.+)$/gm, '<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" disabled> $1</li>');
              
              // Unordered lists
              html = html.replace(/^\\s*[-\\*\\+]\\s+(.+)$/gm, '<li>$1</li>');
              
              // Ordered lists
              html = html.replace(/^\\s*\\d+\\.\\s+(.+)$/gm, '<li>$1</li>');
              
              // Wrap consecutive list items
              html = html.replace(/(<li>.*<\\/li>)(\\s*)(<li>.*<\\/li>)/gs, (match) => {
                const items = match.match(/<li>.*?<\\/li>/gs);
                if (items && items.length > 1) {
                  // Check if it's a task list
                  if (match.includes('task-list-item')) {
                    return \`<ul class="task-list">\${items.join('')}</ul>\`;
                  }
                  return \`<ul>\${items.join('')}</ul>\`;
                }
                return match;
              });
              
              // Handle single list items
              html = html.replace(/^(<li>.*<\\/li>)$/gm, '<ul>$1</ul>');
              
              // Tables
              html = html.replace(/^\\|(.+)\\|$/gm, (match, content) => {
                const cells = content.split('|').map(cell => cell.trim());
                return '<tr>' + cells.map(cell => \`<td>\${cell}</td>\`).join('') + '</tr>';
              });
              
              // Wrap table rows
              html = html.replace(/(<tr>.*<\\/tr>)(\\s*)(<tr>.*<\\/tr>)/gs, (match) => {
                const rows = match.match(/<tr>.*?<\\/tr>/gs);
                if (rows && rows.length > 0) {
                  // First row as header
                  const headerRow = rows[0].replace(/<td>/g, '<th>').replace(/<\\/td>/g, '</th>');
                  const bodyRows = rows.slice(1);
                  return \`<table><thead>\${headerRow}</thead><tbody>\${bodyRows.join('')}</tbody></table>\`;
                }
                return match;
              });
              
              // Line breaks (double space or double newline)
              html = html.replace(/  \\n/g, '<br>\\n');
              html = html.replace(/\\n\\n/g, '</p><p>');
              
              // Wrap in paragraphs
              html = '<p>' + html + '</p>';
              
              // Clean up empty paragraphs and fix paragraph nesting
              html = html.replace(/<p><\\/p>/g, '');
              html = html.replace(/<p>(<h[1-6]>)/g, '$1');
              html = html.replace(/(<\\/h[1-6]>)<\\/p>/g, '$1');
              html = html.replace(/<p>(<hr>)<\\/p>/g, '$1');
              html = html.replace(/<p>(<blockquote>)/g, '$1');
              html = html.replace(/(<\\/blockquote>)<\\/p>/g, '$1');
              html = html.replace(/<p>(<ul)/g, '$1');
              html = html.replace(/(<\\/ul>)<\\/p>/g, '$1');
              html = html.replace(/<p>(<table>)/g, '$1');
              html = html.replace(/(<\\/table>)<\\/p>/g, '$1');
              html = html.replace(/<p>(<pre>)/g, '$1');
              html = html.replace(/(<\\/pre>)<\\/p>/g, '$1');
              
              return html;
            }
            
            // Render the markdown content
            const markdownContent = \`${activeFile.content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
            const htmlContent = parseMarkdown(markdownContent);
            document.getElementById('markdown-content').innerHTML = htmlContent;
          </script>
        </body>
        </html>
      `;
      
      return (
        <iframe
          srcDoc={markdownPreviewHtml}
          className="w-full h-full border-0"
          title="Markdown Preview"
          sandbox="allow-scripts"
        />
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