# Browtiful Strokes — Frontend Git Strategy

## 1. Branching Model
* `main`: Production-ready release branch. Deploys automatically to production hosting upon PR merge.
* `develop`: Integration branch for completed feature branches.
* `feature/<feature-name>`: Scoped branches for individual enhancements (e.g., `feature/cart-enhancements`).
* `fix/<bug-name>`: Targeted hotfix branches.

## 2. Commit Standards
Follow Conventional Commits:
* `feat:` A new user-facing capability or section.
* `fix:` A bug fix in cart, pricing, or layout.
* `test:` Adding or updating unit tests.
* `docs:` Updating PRD, roadmap, or architecture documentation.
* `refactor:` Code refactoring without behavioral alterations.
