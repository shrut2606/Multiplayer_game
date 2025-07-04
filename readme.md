# 🧠 Multiplayer Quiz Game

A real-time multiplayer quiz game where users can create or join rooms, compete on category-based questions, chat live, and track scores — all in a seamless, interactive environment.

## 🚀 Features

- 🔐 Create and join private quiz rooms using room codes
- 👥 Up to **10 players per room** with support for **100+ concurrent rooms**
- 💬 Real-time group chat and synchronized gameplay using **Socket.IO**
- 🎯 Category-based questions with live answer tracking and scoring
- 📊 Structured database to store player data, game sessions, and question sets
- ⚙️ Host-controlled game start and automatic room updates

## 🧩 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: PostgreSQL
- **Realtime Communication**: WebSockets (Socket.IO)

## 🛠️ Getting Started

## 🗄️ Database Integration (PostgreSQL)

This project uses **PostgreSQL** to manage quiz questions and game session data. Create a database and create tables of different categories...
you can see them in lobby.jsx and modify them and create tables like cricket_questions as follows-


---

### 🧱 Schema Design

Each table follows this schema:

| Column           | Type       | Description                          |
|------------------|------------|--------------------------------------|
| `id`             | SERIAL     | Primary key                          |
| `question_type`  | TEXT       | Type of question: `'mcq'` or `'fill'` |
| `text`           | TEXT       | The actual question                  |
| `choices`        | TEXT[]     | Array of choices (for MCQs)          |
| `correct_answer` | TEXT       | The correct answer                   |

> Categories include: `science_questions`, `cricket_questions`, `bollywood_questions`, `gk_questions`, `maths_questions`, `facts_questions`

---

## 🚀 Installation & Setup

```bash
# 1. Clone the repository and navigate into it
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

#4.make .env file and add all the sensitive information like DB_USER-your username etc (see db.js and add everything which it is asking) or just fill it there


# 4. Start the backend server
cd ../backend
npm start

# 5. Start the frontend server in a new terminal window
cd frontend
npm start
```

Once both servers are running, open your browser and visit:

```
http://localhost:3000
```
