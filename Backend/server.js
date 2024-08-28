const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import the http module
const socketIo = require('socket.io');
const dotenv = require('dotenv'); // Import dotenv for environment variables

dotenv.config(); // Load environment variables

const userRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/ReviewRoutes');
const dashboardRoutes = require('./routes/DashboardRoutes');
const GameRoute = require('./routes/gameRoutes');
const quizRoutes = require('./routes/QuizRoutes');
const roomRoutes = require('./routes/RoomRoutes');
const accuracyRoutes = require('./routes/AccuracyRoutes');
const roomFriendGames = require('./routes/roomFriendGameRoutes');
const accuracyRoomRoutes = require('./routes/AccuracyRoomRoutes');
const Room = require('./models/RoomRandom');

const app = express();
app.use(express.json());
app.use(cors());

/*................. Connect to MongoDB Atlas ................. */
const atlasConnection = process.env.MONGO_URI;
mongoose.set('strictQuery', true);
console.log(atlasConnection);

mongoose.connect(atlasConnection, {
    serverSelectionTimeoutMS: 100000, // Adjust timeout as needed
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

/*................. Routes Setup ................. */
app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/game', GameRoute);
app.use('/quiz', quizRoutes);
app.use('/rooms', roomRoutes);
app.use('/accuracy', accuracyRoutes);
app.use('/accuracyRoom', accuracyRoomRoutes);
app.use('/roomFriendGame', roomFriendGames);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect
    methods: ["GET", "POST"]
  }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('create-room', async (data) => {
    try {
      const existingRoom = await Room.findOne({ roomId: data.roomId });
      if (existingRoom) {
        return;
      }
      const room = new Room(data);
      await room.save();
      io.emit('room-created', room);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  });

  socket.on('join-room', async (data) => {
    console.log('join-room data:', data);
    const { roomId, username } = data;

    if (!roomId || !username) {
      console.error('Invalid roomId or username');
      return;
    }

    try {
      const room = await Room.findOne({ roomId });
      if (room && room.players.length < 2) {
        room.players.push(username);
        await room.save();
        io.emit('player-joined', { roomId, players: room.players });

        if (room.players.length === 2) {
          io.emit('game-started', { roomId });
          console.log('Game Started');
        }
      } else {
        console.error('Room is full or not found');
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  socket.on('start-game', async (roomId) => {
    try {
      io.emit('game-started', { roomId });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  });

  socket.on('player-finished', async ({ roomId, player, correctAnswers, totalTimeTaken }) => {
    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        throw new Error('Room not found');
      }

      room.results = room.results || {};
      room.results[player] = { correctAnswers, totalTimeTaken };

      await room.save();

      const players = room.players;
      const opponent = players.find(p => p !== player);
      if (opponent && room.results[opponent]) {
        io.to(roomId).emit('game-over', room.results);
      } else {
        io.to(roomId).emit('player-finished', { player, correctAnswers, totalTimeTaken });
      }

    } catch (error) {
      console.error('Error finishing game:', error.message);
      socket.emit('error', 'Error finishing game');
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// MongoDB connection error handling
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected.');
});

/*................. Start Server ................. */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
