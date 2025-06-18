# IT Helpdesk System - Chatbot

Simple chatbot backend using expressjs, integrating with an external backend and OpenRouter AI.

## 🚀 How to use it

#### Building project

- `cd .\chatbot\` - cd into the project
- `npm install` - install all dependencies
- `npm run build` - Building

#### Updating .env

- Configure `.env` file

#### running project

- `npm run start`
- **IMPORTANT** --- Make sure that app is running on PORT 3000

## API Reference

## Endpoints 🔌

| Method | Path            | Auth Required 🔑 | Description          | Request Body                   | Success Response                       | Status Codes 🔢 |
| ------ | --------------- | ---------------- | -------------------- | ------------------------------ | -------------------------------------- | --------------- |
| `GET`  | `/`             | ❌               | Service health check | `None`                         | `{"content": "all ok"}`                | 200 OK          |
| `POST` | `/chatbot/auth` | ✅               | Validate API key     | `None`                         | `{"content": "Authorized"}`            | 202 Accepted    |
| `POST` | `/chatbot/ask`  | ✅               | Get chatbot response | `ChatCompletionMessageParam[]` | `{"content": "Chatbot response here"}` | 200 OK          |

---

## Authentication 🔒

Require `x-api-key` header with valid [OpenRouter API key](https://openrouter.ai/keys)

**Invalid/Missing Key Responses:**

```json
{"content": "Unauthorized (missing x-api-key header)"}
{"content": "Invalid api key"}

```
