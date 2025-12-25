# Тестовое задание — недвижимость

В репозитории две независимые части:

- `frontend/` — форма объявления (Formik + Yup) + демо Radio/Checkbox биндинга.
- `backend/` — `POST /browse` → RabbitMQ → worker → Selenium Grid → HTML в лог (и опционально в файлы).


## Frontend

cd frontend
npm i
npm run dev

Открой `http://localhost:5173`.

## Backend

По умолчанию наружу открыт только API на `http://localhost:8001` (если нужно — можно переопределить `API_PORT`).

docker compose up --build -d
curl http://localhost:8001/health


Поставить задачу:

```bash
curl -X POST http://localhost:8001/browse \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.avito.ru/"}'
```

Результат:

- лог: `docker compose logs -f worker`
- (опционально) файлы: `./data/html/<task_id>.html` и `./data/html/<task_id>.json`

## Опционально: сохранение HTML в файлы

```bash
docker compose -f docker-compose.yml -f docker-compose.persist.yml up --build -d
```

## Остановка

```bash
docker compose down
```
