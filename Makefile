.PHONY: build up down logs lint test

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

lint:
	cd API && ruff check .
	cd API && black --check .
	cd App && npm run lint

test:
	cd API && pytest

format:
	cd API && black .
	cd API && ruff check --fix .
	cd App && npx prettier --write .
