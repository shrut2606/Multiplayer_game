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

### Prerequisites
- Node.js and npm installed
- PostgreSQL installed and running

## 🚀 Installation & Setup

Follow these steps to run the project locally:

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
