# Full Stack Quiz Game Application

This project is a real-time multiplayer quiz game application built with a React frontend and a Node.js backend.

## Project Description

This application features user authentication, real-time communication using Socket.IO, and a RESTful API for managing users, questions, and games. Players can join game rooms, participate in real-time quizzes, and interact with other players.

## Key Features

- User authentication and session management
- Real-time multiplayer functionality
- MCQ (Multiple Choice Question) system
- RESTful API for user, question, and game management
- Socket.IO for real-time communication between clients and server
- CORS enabled for cross-origin requests
- Environment variable configuration for easy deployment

## Tech Stack

### Frontend
- React with Vite
- Redux for state management
- React Router for navigation
- Tailwind CSS for styling
- Socket.IO client for real-time communication

### Backend
- Node.js with Express.js
- MongoDB for database
- Socket.IO for WebSocket communication
- JSON Web Tokens (JWT) for authentication
- Cookie-parser for handling cookies
- CORS for cross-origin resource sharing

## Prerequisites

- Node.js (version 12.0.0 or higher)
- npm (usually comes with Node.js)

## Setup and Installation

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:3000.

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd Backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Environment Variables

1. In the Backend directory, create a .env file:
   ```
   touch .env
   ```
2. Open the .env file and add the necessary environment variables. For example:
   ``` 
   MONGODB_URI=your_mongodb_connection_string
   ```
   Adjust these variables according to your specific project needs.

## Running the Application

1. Start the backend server (from the Backend directory):
   ```
   npm run dev
   ```
2. In a new terminal, start the frontend development server (from the frontend directory):
   ```
   npm run dev
   ```
3. Open your browser and navigate to http://localhost:3000 to view the application.

## Building for Production

### Frontend
In the frontend directory:
```
npm run build
```

### Backend
In the Backend directory:
```
npm run build
```
