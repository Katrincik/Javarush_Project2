# JavaRush Chat Application

A simple real-time chat app built with Node.js (Express), PostgreSQL, and a lightweight frontend (HTML, CSS, JS) — containerized with Docker Compose and served via NGINX.

---

## Desktop-Only Notice

> **Note:** This project is currently designed and optimized only for computer (desktop) use.
> The layout and interactions are not yet adapted for mobile or tablet screens.

---

## Features

- User registration with optional avatar upload (upload need implementation)
- Messages stored in PostgreSQL  
- Refresh of new messages on reload pages (need implementation on auto-fresh)
- Editable messages (“config” button for your own messages)  (need fixation in css)
- Clean layout with dynamic DOM rendering (no frameworks)

---

## Prerequisites

You need:
- **Docker** & **Docker Compose**
- Node.js ≥ 18 and npm if running the backend manually

---

## Run with Docker 
Run the entire stack (database, backend, and frontend via nginx):

```bash
docker compose up --build
```

## Running the Application

Once everything is running, open your browser and go to: **[http://localhost:80](http://localhost:80)**

---

## Example User Flow

1. Open **[http://localhost:80](http://localhost:80)** in your browser
2. Enter a username 
3. Start chatting — your messages appear instantly in the chat window
4. Click the config button next to your own messages to edit or delete them
5. Open another browser tab or private window to test multiple user sessions
6. *(Planned)* Messages will be added at reload of the page

