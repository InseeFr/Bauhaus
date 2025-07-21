---
title: Conventional Commits
---

To maintain a clean and readable commit history, **we enforce the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard**.

## What is a Conventional Commit?

A conventional commit follows this structure:

```
<type>(optional scope): <description>

[optional body]

[optional footer(s)]
```

### Examples

- `feat(auth): add support for OAuth2 login`
- `fix(api): handle 500 errors from backend`
- `docs(readme): update setup instructions`
- `refactor(ui): simplify button component`

---

## PR Titles

Your **pull request title must also follow the Conventional Commit format**.

> ⚠️ If the PR title does not follow this convention, **GitHub Actions will fail**, and the PR will be blocked from merging.

---

## better-commits

To simplify writing correct commit messages, we recommend using [`better-commits`](https://github.com/beraliv/better-commits).

You can run it without installation:

```bash
npx better-commits
```

It will guide you through a step-by-step prompt to generate a properly formatted Conventional Commit.

You can also install it globally:

```bash
npm install -g better-commits
```

Then use it as:

```bash
better-commits
```

---

## Accepted Commit Types

| Type       | Description                                          |
| ---------- | ---------------------------------------------------- |
| `feat`     | A new feature                                        |
| `fix`      | A bug fix                                            |
| `docs`     | Documentation-only changes                           |
| `style`    | Code style changes (formatting, no logic impact)     |
| `refactor` | Code changes that don't fix a bug or add a feature   |
| `test`     | Adding or updating tests                             |
| `chore`    | Maintenance tasks, tooling                           |
| `ci`       | Changes to CI/CD configuration                       |
| `build`    | Changes that affect the build system or dependencies |

---

## Benefits

- 📖 Clear and standardized commit history
- 🚀 Support for automated changelogs and semantic releases
- 🔁 PR validation via GitHub Actions
- 🤖 Easy integration with tools like `better-commits`

By following this convention and using `better-commits`, we ensure consistency and automation across all contributions.
