# SuiDev Labs Blog - Makefile
# =============================================================================

.PHONY: help install dev build clean serve deploy

# Default target
help:
	@echo "SuiDev Labs Blog - Available Commands"
	@echo "======================================"
	@echo ""
	@echo "  make install   - Install npm dependencies"
	@echo "  make dev       - Start development server with hot reload"
	@echo "  make build     - Build production site to _site/"
	@echo "  make clean     - Remove _site/ directory"
	@echo "  make serve     - Serve built site locally (requires npx serve)"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy    - Build and show deployment instructions"
	@echo ""

# Install dependencies
install:
	npm install

# Development server with hot reload
dev:
	npm run dev

# Production build
build:
	npm run build

# Clean build directory
clean:
	rm -rf _site

# Serve built site (for testing production build locally)
serve: build
	npx serve _site

# Build and show deployment info
deploy: build
	@echo ""
	@echo "Build complete! Site is in _site/"
	@echo ""
	@echo "To deploy to GitHub Pages:"
	@echo "  1. Commit and push to main branch"
	@echo "  2. GitHub Actions will automatically build and deploy"
	@echo ""
	@echo "To deploy to a VPS with nginx:"
	@echo "  1. Copy _site/ contents to your web root"
	@echo "  2. See README.md for nginx configuration"
	@echo ""
