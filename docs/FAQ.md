# FAQ - Frequently Asked Questions

## General Questions

### What is CodeSpace?
CodeSpace is a full-featured, browser-based IDE that supports multiple programming languages including Python, JavaScript, TypeScript, HTML, CSS, and JSON. It runs entirely in your browser with no installation required.

### Is CodeSpace free to use?
Yes! CodeSpace is completely free and open-source under the MIT license. You can use it for personal projects, educational purposes, or commercial work.

### Do I need to install anything?
No installation required! Simply open your browser and navigate to the CodeSpace URL. Everything runs in your browser using modern web technologies.

### What browsers are supported?
CodeSpace works on all modern browsers:
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Features & Functionality

### What programming languages are supported?
- **Python**: Full algorithm support with advanced interpreter
- **JavaScript**: Real-time execution with console output
- **TypeScript**: Type checking and compilation
- **HTML/CSS**: Live preview functionality
- **JSON**: Syntax highlighting and validation

### Can I run complex Python algorithms?
Yes! CodeSpace includes an advanced Python execution engine that supports:
- Complex algorithms (N-Queens, sorting, graph traversals)
- Object-oriented programming (classes, inheritance)
- Data structures (lists, dictionaries, sets)
- Function definitions and calls
- F-string formatting
- Control flow (loops, conditionals)

### Is my code saved automatically?
Yes! CodeSpace automatically saves your projects to your browser's local storage. Your work persists between sessions, but remember to export important projects as backups.

### Can I work on multiple files simultaneously?
Absolutely! CodeSpace supports:
- Multiple file tabs
- File tree navigation
- Folder organization
- Drag & drop file management
- Copy/paste operations

## Technical Questions

### How does code execution work?
CodeSpace uses different execution strategies:
- **Python**: Advanced interpreter simulation with algorithm support
- **JavaScript**: Real-time execution in sandboxed environment
- **HTML/CSS**: Live preview rendering
- **TypeScript**: Compilation to JavaScript then execution

### Is my code secure?
Yes! Your code:
- Never leaves your browser
- Runs in isolated, sandboxed environments
- Cannot access your file system
- Cannot make external network requests
- Is stored locally with encryption

### What happens to my projects?
Projects are stored in your browser's localStorage:
- They persist between browser sessions
- They're tied to your specific browser/device
- They're automatically encrypted
- You can export them as backup files

### Can I share my projects?
Currently, you can:
- Copy and paste code to share
- Export projects as files
- Take screenshots of your work
- *Real-time collaboration is planned for future releases*

## Troubleshooting

### My code isn't running properly
Try these steps:
1. Check for syntax errors (red underlines in editor)
2. Clear your browser cache and reload
3. Try running in an incognito/private window
4. Check the browser console for error messages
5. Ensure you're using a supported browser version

### I lost my project!
If your project disappeared:
1. Check if you're in the same browser/device
2. Look in browser developer tools → Application → Local Storage
3. Try refreshing the page
4. Check if you accidentally deleted it
5. Look for any browser cleanup/privacy tools that might clear data

### The editor is slow or unresponsive
To improve performance:
1. Close unused tabs in CodeSpace
2. Close other browser tabs to free memory
3. Restart your browser
4. Check if browser extensions are interfering
5. Try using a different browser

### Code execution is not working
If code won't execute:
1. Check for syntax errors in your code
2. Ensure you've selected the correct language
3. Try with a simple "Hello World" example
4. Check browser console for error messages
5. Clear browser cache and try again

## Development & Contributing

### How can I contribute to CodeSpace?
We welcome contributions! You can:
- Report bugs via GitHub issues
- Suggest new features
- Submit pull requests
- Improve documentation
- Help with testing

See our [Contributing Guide](CONTRIBUTING.md) for details.

### Can I self-host CodeSpace?
Yes! CodeSpace is open-source and can be self-hosted:
```bash
git clone https://github.com/umairism/codespace.git
cd codespace
npm install
npm run build
npm run preview
```

### How do I report bugs?
1. Check if the bug already exists in GitHub issues
2. Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Include detailed steps to reproduce
4. Add screenshots if relevant
5. Specify your browser and OS

## Future Plans

### What features are coming next?
Planned features include:
- Real-time collaboration
- Git integration
- More programming languages (C++, Java, Go, Rust)
- Plugin system
- Cloud storage sync
- Mobile app companion
- AI code suggestions

### Can I request new features?
Absolutely! Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) to suggest new ideas.

## Getting Help

### Where can I get help?
- 📖 Check this FAQ first
- 📚 Read the [Documentation](docs/README.md)
- 🐛 [Report bugs](https://github.com/umairism/codespace/issues/new?template=bug_report.md)
- 💡 [Request features](https://github.com/umairism/codespace/issues/new?template=feature_request.md)
- ❓ [Ask questions](https://github.com/umairism/codespace/issues/new?template=question.md)
- 📧 Email: iamumair1124@gmail.com

### How do I stay updated?
- ⭐ Star the repository on GitHub
- 👀 Watch the repository for notifications
- 📢 Follow [@umairism](https://github.com/umairism) on GitHub
- 📋 Check the [Changelog](CHANGELOG.md) for updates

---

**Didn't find your answer?** [Ask a question](https://github.com/umairism/codespace/issues/new?template=question.md) and we'll help you out!
