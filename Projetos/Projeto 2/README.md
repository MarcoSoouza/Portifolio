# Task Management Web App

## How to Run the Project

Follow these steps to run the application locally.

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) installed and running locally.

### 1. Start MongoDB
Ensure your local MongoDB service is running.
```bash
mongod
```

### 2. Start the Backend
Open a terminal and run:
```bash
cd backend
npm install
node server.js
```
*Note: If you defined a start script in package.json, you can use `npm start` instead.*

### 3. Start the Frontend
Open a new terminal window and run:
```bash
cd frontend
npm install
npm start
```

The application should now be running, typically accessible at `http://localhost:3000`.