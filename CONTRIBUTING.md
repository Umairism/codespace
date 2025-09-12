# Contributing to CodeSpace

First off, thanks for taking the time to contribute! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check if the issue already exists. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**  
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if possible**

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### 🔧 Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setting Up Your Development Environment

```bash
# Clone your fork
git clone https://github.com/umairism/codespace.git
cd codespace

# Add upstream remote
git remote add upstream https://github.com/umairism/codespace.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Code Style

We use ESLint and Prettier to maintain code quality:

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Commit Messages

We follow conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semi colons, etc
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` updating build tasks, package manager configs, etc

Example:
```
feat: add support for Python class definitions

- Implement class parsing in execution engine
- Add object instantiation support
- Update tests for new functionality
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Editor/         # Editor-related components
│   ├── Layout/         # Layout components
│   └── UI/             # Reusable UI components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Adding New Features

### Adding a New Language

1. Update `src/utils/fileUtils.ts` with language detection
2. Add syntax highlighting in `src/components/Editor/CodeEditor.tsx`
3. Implement execution logic in `src/hooks/useCodeExecution.ts`
4. Add tests for the new language
5. Update documentation

### Adding New Components

1. Create component in appropriate directory
2. Include TypeScript interfaces
3. Add proper prop validation
4. Include unit tests
5. Export from index file
6. Update Storybook if applicable

## Code Review Process

1. All submissions require review
2. We may suggest changes, improvements, or alternatives
3. Changes must pass all tests and linting
4. Maintainers will merge approved PRs

## Questions?

Feel free to reach out:
- Open an issue for technical questions
- Email: iamumair1124@gmail.com
- Twitter: [@umairism](https://twitter.com/umairism)

Thanks for contributing! 🚀
