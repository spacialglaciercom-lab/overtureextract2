# Contributing to Overture OSM Extractor Mobile

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Follow the [Quick Start Guide](QUICKSTART.md)
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (2 spaces, single quotes)
- Add JSDoc comments for public functions
- Keep components under 300 lines when possible

## Commit Messages

Use conventional commits:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `refactor: improve code structure`
- `test: add tests`

## Pull Request Process

1. Ensure your code builds without errors: `npm run build`
2. Update documentation if needed
3. Add a clear PR description
4. Link any related issues
5. Request review from maintainers

## Testing

- Test on iOS Simulator (iPhone 14/15 Pro)
- Test on physical device if possible
- Verify map interactions work smoothly
- Check WebSocket connections

## Reporting Issues

Include:
- iOS version
- Device model
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Code of Conduct

Be respectful and constructive in all interactions.
