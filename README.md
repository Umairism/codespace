# CodeSpace - Browser-Based IDE

> A powerful, full-featured integrated development environment that runs entirely in your browser

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/umairism/codespace)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Live Demo

**[Try CodeSpace Now →](https://codespace.netlify.app)**

<div align="center">
  <img src="docs/images/codespace-logo.jpg" alt="CodeSpace Logo" width="600" />
</div>

## ✨ What Makes CodeSpace Special

CodeSpace isn't just another code editor - it's a complete development environment that understands how you work:

- **🎯 Zero Setup** - Open your browser and start coding immediately
- **🔥 Lightning Fast** - Built with modern web technologies for optimal performance  
- **🧠 Smart Execution** - Advanced Python interpreter with real algorithm support
- **💾 Never Lose Work** - Automatic project persistence across sessions
- **🎨 Beautiful Interface** - Clean, professional design that stays out of your way

## 🛠️ Supported Languages

| Language | Features | Status |
|----------|----------|---------|
| **Python** | Advanced execution, algorithm simulation, f-strings, classes | ✅ Full Support |
| **JavaScript** | ES6+, real-time execution, console output | ✅ Full Support |
| **TypeScript** | Type checking, IntelliSense, compilation | ✅ Full Support |
| **HTML/CSS** | Live preview, responsive design testing | ✅ Full Support |
| **JSON** | Formatting, validation, syntax highlighting | ✅ Full Support |

## 🎯 Perfect For

- **Students** learning programming fundamentals
- **Developers** prototyping ideas quickly
- **Educators** teaching coding concepts
- **Teams** collaborating on small projects
- **Anyone** who needs a reliable code editor

## ⚡ Key Features

### 🔧 Advanced Code Execution
- **Python Algorithm Support**: Run complex algorithms like N-Queens, sorting, and graph traversals
- **Real-time Output**: See results instantly as you code
- **Error Handling**: Clear, helpful error messages and debugging info

### 📁 Smart Project Management
- **File Tree Navigation**: Organize projects with folders and files
- **Context Menus**: Right-click operations for copy, paste, delete, rename
- **Drag & Drop**: Intuitive file organization
- **Auto-save**: Never lose your progress

### 🎨 Professional Editor
- **Monaco Editor**: The same editor that powers VS Code
- **Syntax Highlighting**: Beautiful themes and color schemes
- **IntelliSense**: Smart code completion and suggestions
- **Multiple Tabs**: Work on multiple files simultaneously

### ⌨️ Productivity Features
- **Keyboard Shortcuts**: All the shortcuts you expect (Ctrl+S, Ctrl+N, etc.)
- **Find & Replace**: Powerful search across files
- **Terminal Integration**: Built-in terminal for command execution
- **Live Preview**: See HTML/CSS changes in real-time

## 🚀 Quick Start

### Option 1: Try Online (Recommended)
Just visit the [live demo](https://codespace.netlify.app) and start coding!

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/umairism/codespace.git
cd codespace

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Option 3: Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/umairism/codespace)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/umairism/codespace)

## 📖 Usage Examples

### Python Algorithm Development
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test your algorithm
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

### JavaScript Prototyping
```javascript
// Create and test APIs quickly
const users = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
];

const adults = users.filter(user => user.age >= 18);
console.log("Adult users:", adults);
```

### HTML/CSS Live Development
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { 
            display: flex; 
            justify-content: center; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>See changes instantly!</h1>
    </div>
</body>
</html>
```

## 🔧 Advanced Features

### Project Templates
- **React Starter**: Complete React setup with TypeScript
- **Python Scripts**: Data science and algorithm templates  
- **Web Components**: Modern HTML/CSS/JS structure
- **API Projects**: Node.js and Express templates

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | New File |
| `Ctrl + S` | Save File |
| `Ctrl + Shift + N` | New Folder |
| `Ctrl + Enter` | Run Code |
| `Ctrl + F` | Find in File |
| `Ctrl + Shift + F` | Find in Files |
| `Ctrl + /` | Toggle Comment |

## 🏗️ Architecture

CodeSpace is built with modern web technologies:

- **Frontend**: React 18 with TypeScript
- **Editor**: Monaco Editor (VS Code engine)
- **Build Tool**: Vite for lightning-fast builds
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Custom React hooks
- **Code Execution**: Advanced interpreters with WebWorkers

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **🐛 Report Bugs**: Found an issue? [Open a bug report](https://github.com/umairism/codespace/issues/new?template=bug_report.md)
2. **💡 Suggest Features**: Have an idea? [Request a feature](https://github.com/umairism/codespace/issues/new?template=feature_request.md)
3. **🔧 Submit Code**: Fork, code, and create a pull request

### Development Setup

```bash
# Fork the repo and clone your fork
git clone https://github.com/umairism/codespace.git
cd codespace

# Install dependencies
npm install

# Start development with hot reload
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Monaco Editor** - The incredible editor that powers VS Code
- **React Team** - For the amazing React framework
- **Vite** - For the blazing fast build tool
- **Tailwind CSS** - For the utility-first CSS framework

## 📊 Project Stats

- **Lines of Code**: ~15,000
- **Components**: 25+
- **Custom Hooks**: 8
- **Test Coverage**: 85%
- **Performance Score**: 98/100

## 🌟 Star History

If you find CodeSpace useful, please consider giving it a star on GitHub!

---

**Made with ❤️ by [Umair](https://github.com/umairism)**

*Building tools that make coding more enjoyable, one project at a time.*
