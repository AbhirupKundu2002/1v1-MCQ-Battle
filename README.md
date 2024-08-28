Full Stack Quiz Game Application
This project is a real-time multiplayer quiz game application built with a React frontend and a Node.js backend.

Project Description
This application features user authentication, real-time communication using Socket.IO, and a RESTful API for managing users, questions, and games. Players can join game rooms, participate in real-time quizzes, and interact with other players.

Key Features
User authentication and session management
Real-time multiplayer functionality
MCQ (Multiple Choice Question) system
RESTful API for user, question, and game management
Socket.IO for real-time communication between clients and server
CORS enabled for cross-origin requests
Environment variable configuration for easy deployment
Tech Stack
Frontend
React with Vite
Redux for state management
React Router for navigation
Tailwind CSS for styling
Socket.IO client for real-time communication
Backend
Node.js with Express.js
MongoDB for database
Socket.IO for WebSocket communication
JSON Web Tokens (JWT) for authentication
Cookie-parser for handling cookies
CORS for cross-origin resource sharing
Prerequisites
Node.js (version 12.0.0 or higher)
npm (usually comes with Node.js)
Frontend Setup
Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will be available at http://localhost:5173.

Backend Setup
Navigate to the backend directory:

cd Backend

Install dependencies:

npm install

Start the development server:

npm run dev

Environment Variables
In the Backend directory, create a .env file:

touch .env

Open the .env file and add the necessary environment variables. For example:

PORT=8000 MONGODB_URI=your_mongodb_connection_string JWT_SECRET=your_jwt_secret

Adjust these variables according to your specific project needs.

Running the Application
Start the backend server (from the Backend directory):

npm run dev

In a new terminal, start the frontend development server (from the frontend directory):

npm run dev

Open your browser and navigate to http://localhost:5173 to view the application.

Building for Production
Frontend
In the frontend directory:

npm run build

Backend
In the Backend directory:

npm run build

