# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions of CodeSpace:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of CodeSpace seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT report security vulnerabilities through public GitHub issues.

Instead, please report them via email to: **iamumair1124@gmail.com**

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

We prefer all communications to be in English.

### Response Timeline

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 7 days
- **Status Updates**: We will send regular updates about our progress every 7 days
- **Resolution**: We aim to resolve Critical and High severity issues within 30 days

## Security Measures

CodeSpace implements several security measures to protect users:

### Client-Side Security
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Input Sanitization**: All user input is properly sanitized
- **Code Execution Isolation**: User code runs in isolated contexts
- **LocalStorage Encryption**: Sensitive data is encrypted before storage

### Code Execution Safety
- **Sandboxed Environment**: Code execution is contained and isolated
- **Resource Limits**: Prevents infinite loops and memory exhaustion
- **No Network Access**: User code cannot make external network requests
- **Safe Evaluation**: Using secure evaluation methods instead of direct `eval()`

### Data Protection
- **No Server Storage**: All data stays in the user's browser
- **Local Encryption**: Project data is encrypted in localStorage
- **No Tracking**: We don't collect or store personal information
- **HTTPS Only**: All communications are encrypted in transit

## Known Security Considerations

### Code Execution Limitations
- User code runs in a simulated environment, not a real interpreter
- Some advanced Python/JavaScript features may not work as expected
- File system access is virtualized and cannot access real system files

### Browser Security
- CodeSpace relies on browser security features
- Users should keep their browsers updated
- Private browsing mode recommended for sensitive code

## Best Practices for Users

### Safe Coding Practices
- Don't include sensitive information (passwords, API keys) in your code
- Be cautious when copying code from untrusted sources
- Use private browsing mode for confidential projects
- Regularly clear browser data if working on sensitive projects

### Browser Security
- Keep your browser updated to the latest version
- Use reputable browsers with good security track records
- Enable browser security features and warnings
- Be cautious with browser extensions that might access page data

## Vulnerability Disclosure Policy

We follow a responsible disclosure model:

1. **Private Disclosure**: Security issues are first reported privately
2. **Investigation**: We investigate and develop fixes
3. **Patch Release**: Security fixes are released as quickly as possible
4. **Public Disclosure**: Details are shared publicly after fixes are deployed
5. **Recognition**: We acknowledge security researchers (with permission)

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 1.0.1, 1.0.2)
- Documented in the changelog with severity ratings
- Announced through GitHub releases and security advisories
- Communicated via email to users who opt-in for security notifications

## Contact Information

For security-related inquiries:
- **Email**: iamumair1124@gmail.com
- **Subject Line**: [SECURITY] Brief description of the issue
- **Encryption**: PGP key available upon request

For general questions about this policy:
- Open an issue on GitHub with the `security` label
- Email with subject line: [SECURITY POLICY] Your question

## Hall of Fame

We recognize security researchers who help make CodeSpace safer:

*No reports yet - be the first to help improve our security!*

---

**Note**: This security policy is subject to change. Please check back regularly for updates. Last updated: September 12, 2025.
