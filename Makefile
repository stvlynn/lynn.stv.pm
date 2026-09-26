.PHONY: dev build check test lint format docs help

dev: ## Run API and frontend with hot reload
	@pnpm dev

build: ## Build frontend and backend bundles
	@pnpm build

check: ## Typecheck, lint, format check, tests and doc links
	@pnpm check

test: ## Run all test suites
	@pnpm test

lint: ## Run ESLint (includes FSD and DDD boundary rules)
	@pnpm lint

format: ## Format with Prettier
	@pnpm format

docs: ## Validate documentation links
	@pnpm docs:check

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'
