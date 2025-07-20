up:
	docker compose up --build

down:
	docker compose down

restart:
	docker compose down && docker compose up --build

logs:
	docker compose logs -f app

db:
	docker compose exec app npx prisma migrate dev --name init

generate:
	docker compose exec app npx prisma generate

studio:
	docker compose exec app npx prisma studio

db_deploy:
	docker compose exec app npx prisma migrate deploy
