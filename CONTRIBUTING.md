# Contributing to Panchang App

Thank you for your interest in contributing! Please read these guidelines before submitting a pull request.

---

## Development Setup

### Prerequisites
- **Go** 1.21+
- **Node.js** 18+
- **npm** 9+

### Running Locally

```bash
# Terminal 1 — Backend
cd backend
go run .

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Or use the helper script:
```powershell
.\start.ps1
```

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready |
| `feat/*` | New features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation only |
| `chore/*` | Refactoring, dependency updates |

---

## Pull Request Guidelines

1. **Fork** the repository and create your branch from `main`.
2. **Write meaningful commit messages** following [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add nakshatra display in DayPanel`
   - `fix: correct moon longitude calculation for southern hemisphere`
3. **One feature per PR** — keep changes focused and reviewable.
4. **Test your changes** — ensure the backend compiles (`go build ./...`) and the frontend builds (`npm run build`).
5. **Update the README** if you add or change any API endpoints or UI features.

---

## Code Style

### Go (Backend)
- Follow standard Go formatting: run `gofmt -w .` before committing.
- All exported functions must have a doc comment.
- Use meaningful variable names; avoid single-letter names outside of loop iterators.

### JavaScript / React (Frontend)
- Use functional components and React hooks only.
- Keep components small and single-responsibility.
- File naming: `PascalCase.jsx` for components, `camelCase.js` for utilities and hooks.

---

## Reporting Issues

Please use [GitHub Issues](../../issues) to report bugs or request features. Include:
- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behaviour
- Screenshots or logs if applicable

---

## License

By contributing, you agree that your contributions will be licensed under the same license as this project.
