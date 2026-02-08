# LuckyLens Dev Server Commands

.PHONY: help install dev build start docker-build docker-run docker-stop clean

help: ## Show this help message
	@echo "LuckyLens Dev Server Commands"
	@echo "=============================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start development server with hot reload
	npm run dev

build: ## Build production static files
	npm run build

start: build ## Build and start production server
	npx serve -s dist -p 3000

setup: ## Run setup script for dev server
	chmod +x setup-dev-server.sh
	./setup-dev-server.sh

# Docker commands
docker-build: ## Build Docker image
	docker build -t luckylens .

docker-run: ## Run Docker container
	docker run -d -p 3000:3000 --name luckylens-dev luckylens

docker-stop: ## Stop and remove Docker container
	docker stop luckylens-dev || true
	docker rm luckylens-dev || true

docker-compose-up: ## Start with Docker Compose
	docker-compose up -d

docker-compose-down: ## Stop Docker Compose
	docker-compose down

docker-compose-logs: ## View Docker Compose logs
	docker-compose logs -f

# Utility commands
clean: ## Clean build artifacts and dependencies
	rm -rf node_modules .next dist
	@echo "Cleaned! Run 'make install' to reinstall."

update: ## Update dependencies
	npm update

lint: ## Run linter
	npm run lint

test: ## Run tests (if configured)
	npm test

# Deployment shortcuts
deploy-static: build ## Deploy static files (copy to web root)
	@echo "Static files built in 'dist/' directory"
	@echo "Copy these files to your web server:"
	@echo "  sudo cp -r dist/* /var/www/html/"

deploy-docker: docker-build ## Build Docker image for deployment
	@echo "Docker image 'luckylens' built"
	@echo "Push to registry: docker tag luckylens your-registry/luckylens"
