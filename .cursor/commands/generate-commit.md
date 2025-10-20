# Generate Commit Message

Analyze the current git changes and generate a commit message following the Conventional-Commits（[conventionalcommits.org](https://github.com/conventional-commits/conventionalcommits.org)） specification.

## Requirements

1. **Analyze the staged changes** using `git diff --cached` or `git status`
2. **Generate a commit message** with the following structure:

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (white-space, formatting, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools
- `ci`: Changes to CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies

## Guidelines

- **Subject line**: Max 72 characters, lowercase, no period at the end
- **Scope**: Optional, should be a noun describing the section of codebase (e.g., parser, api, ui)
- **Body**: Optional, detailed explanation of what and why (not how)
- **Footer**: Optional, reference issues, breaking changes

## Breaking Changes

If there are breaking changes, include `BREAKING CHANGE:` in the footer or add `!` after the type/scope.

Example:
```
feat(api)!: remove deprecated endpoints

BREAKING CHANGE: The /v1/users endpoint has been removed. Use /v2/users instead.
```

## Output Format

Please provide:
1. A brief summary of what changed
2. The recommended commit message
3. Optional: Alternative versions if multiple types could apply

