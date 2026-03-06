# Contributing to L-SPA Web

Thank you for your interest in contributing! This document outlines how to contribute to the project in a respectful, efficient, and maintainable way.

What you can contribute
- Bug fixes
- Enhancements to features or UI/UX
- Documentation improvements (README, guides, changelog)
- Tests or CI improvements

Getting started
- Prerequisites: Node.js installed, access to the repo.
- Fork the repository and clone your fork.
- Install dependencies:
  ```bash
  npm install
  ```
- Run the dev server:
  ```bash
  npm run dev
  ```

Branching and commits
- Use descriptive branch names, e.g. feature/auth-flow, fix/lint-errors, chore/ci-config
- Commit messages should be concise and follow the style: "Feat: add user authentication flow" or "Fix: lint issues in App.tsx"
- Push changes and open a PR against the main branch

Code quality and tests
- Ensure code passes linting (npm run lint)
- Add tests where appropriate (existing test suite or new tests)
- Keep changes focused and minimal to ease review

Design and UX
- Improvements should align with the project’s UX/UI patterns described in README
- Propose design changes via issues before implementing large UI changes

Pull request etiquette
- Link to related issues
- Describe the motivation and impact of the changes in the PR body
- Include screenshots or gif if UI changes are significant
