# Frontend

## Стек

- Vite + React + TypeScript
- Mantine UI
- React Router
- React Query
- Day.js

## Переменные окружения

Скопируйте шаблон и укажите адрес API:

```bash
cp .env.example .env
```

`VITE_API_BASE_URL` по умолчанию указывает на Prism mock `http://127.0.0.1:4010`.

## Скрипты

```bash
npm run dev          # локальная разработка
npm run lint         # линт
npm run typegen:openapi  # генерация OpenAPI из TypeSpec
npm run prism:mock       # запуск Prism mock на 4010
npm run dev:mock         # typegen + prism mock
```

## Локальный запуск с Prism

1. Установите зависимости TypeSpec:

```bash
cd typespec
npm install
```

2. В отдельной вкладке терминала:

```bash
cd frontend
npm run dev:mock
```

3. В другой вкладке:

```bash
cd frontend
npm run dev
```

## Структура

- `src/pages` — страницы приложения
- `src/components` — общие компоненты
- `src/api` — клиент для API
- `src/types` — типы API
