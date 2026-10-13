# Логистика.Про — Лабораторная №4 (Авторизация, Swagger, Redis)

## Цель работы

Завершение бэкенда для SPA: добавление авторизации через сессии и cookie,
хранение сессий в Redis, документирование API через Swagger,
автоматическое заполнение автора услуги при создании.

## Запуск

1. `docker compose up -d` — поднять PostgreSQL, MinIO, Redis.
2. `alembic upgrade head` — применить миграции.
3. `pip install -r requirements.txt` — установить зависимости.
4. `uvicorn main:app --reload` — запустить сервер.

Swagger UI: `http://127.0.0.1:8000/docs`
ReDoc:      `http://127.0.0.1:8000/redoc`

## Что нового в ЛР4

- **Авторизация через сессии и cookie.** При логине создаётся UUID сессии,
  который сохраняется в Redis по ключу `session:<uuid>` со значением `user_id`
  и TTL 3600 секунд. Клиент получает HttpOnly-cookie `session_id`.
- **Хеширование паролей.** Пароли хранятся в БД в виде bcrypt-хеша
  (`passlib[bcrypt]`), исходный пароль нигде не сохраняется.
- **Разделение доступа.** Без авторизации доступно только чтение (GET-методы).
  Методы создателя (`POST`, `PUT`, `DELETE`, `POST /like`) требуют cookie `session_id`.
- **Swagger с cookieAuth.** В Swagger UI добавлена кнопка Authorize для вставки
  значения `session_id`.
- **Автозаполнение автора.** При создании услуги (`POST /api/maintenances`)
  поле `author_id` проставляется автоматически из текущей сессии.
- **Переименование домена.** Сущность `Transport` переименована в `Maintenance`
  (таблица `maintenances`, поле `likes.maintenance_id`).
- **Redis как хранилище сессий.** Stateful-аутентификация: сессии переживают
  перезапуск приложения и доступны всем инстансам.

## Таблицы БД

### users
| Поле | Тип | Описание |
|---|---|---|
| id | integer PK | Идентификатор |
| username | varchar(50) | Уникальное имя |
| password_hash | varchar(255) | Bcrypt-хеш пароля |

### maintenances
| Поле | Тип | Описание |
|---|---|---|
| id | integer PK | Идентификатор |
| title | varchar(100) | Название |
| description | varchar(500) | Описание |
| status | varchar(20) | draft / published / deleted |
| image_url | varchar(500) | Имя файла в MinIO |
| video_url | varchar(500) | Имя файла в MinIO |
| speed_kmh | integer | Скорость |
| price_per_km | integer | Тариф |
| created_at | timestamp | Дата создания |
| published_at | timestamp | Дата публикации |
| author_id | integer FK users.id | Создатель |
| likes | integer | Счётчик лайков |

### likes
| Поле | Тип | Описание |
|---|---|---|
| id | integer PK | Идентификатор |
| user_id | integer FK users.id | Кто лайкнул |
| maintenance_id | integer FK maintenances.id | Что лайкнули |

Уникальное ограничение: `(user_id, maintenance_id)`.

## HTTP API

### Домен Users
| Метод | URL | Описание | Входные данные | Выходные данные |
|---|---|---|---|---|
| POST | `/api/users/register` | Регистрация | `{username, password}` | `{id, username}` |
| POST | `/api/users/login` | Вход, создаёт cookie `session_id` | `{username, password}` | `{user_id, username}` + `Set-Cookie` |
| POST | `/api/users/logout` | Выход, удаляет сессию | cookie `session_id` | `{message}` |

### Домен Maintenances
| Метод | URL | Описание | Доступ |
|---|---|---|---|
| GET | `/api/maintenances` | Список услуг с фильтром | Гость, создатель |
| GET | `/api/feed` | Первая карточка ленты | Гость, создатель |
| GET | `/api/feed/{id}/next?next=true` | Следующая карточка ленты | Гость, создатель |
| GET | `/api/drafts` | Черновик текущего пользователя | Создатель |
| POST | `/api/maintenances` | Создать черновик + файлы | Создатель |
| PUT | `/api/maintenances/{id}/publish` | Публикация | Автор |
| DELETE | `/api/maintenances/{id}` | Soft delete | Автор |
| POST | `/api/maintenances/{id}/like` | Поставить/снять лайк | Создатель |

## Авторизация

- **Метод:** сессии в Redis + HttpOnly-cookie `session_id`.
- **Логин:** `POST /api/users/login` → сервер создаёт `session:<uuid>` в Redis,
  устанавливает cookie `session_id` (HttpOnly, SameSite=Lax, max-age=3600).
- **Проверка:** зависимость `get_current_user` берёт `session_id` из cookie,
  ищет запись в Redis, извлекает `user_id`, загружает пользователя из БД.
- **Для гостей:** `get_current_user_optional` возвращает `None`, если cookie нет —
  используется в GET-методах (лента, каталог).

### Как авторизоваться в Swagger

1. Открыть `http://127.0.0.1:8000/docs`.
2. `POST /api/users/register` — создать пользователя.
3. `POST /api/users/login` — войти. Ответ содержит `Set-Cookie: session_id=...`.
4. Скопировать значение cookie из DevTools → Application → Cookies
   (или из заголовков ответа).
5. Нажать кнопку **Authorize** в Swagger, вставить значение `session_id`.
6. Теперь защищённые методы (`POST`, `PUT`, `DELETE`) доступны.

## Содержимое Redis

Все активные сессии хранятся в Redis в виде пар ключ-значение:
