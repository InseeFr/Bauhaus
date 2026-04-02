---
title: Gitleaks
---

Gitleaks is available on the **Bauhaus** and **Back Office** repositories via a Git `pre-commit` hook.

## Prerequisites

Gitleaks must be installed on your system. See the [official installation guide](https://github.com/gitleaks/gitleaks#installing).

## Back Office

For the Back Office project, you need to run the following command beforehand to make the hook effective:

```bash
mvn install -DskipTests
```
