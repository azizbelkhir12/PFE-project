const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

// Route imports
const routes = require('./routes/index.js');
const donorRoutes = require('./routes/donorRoutes');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require("./routes/feedbackRoutes");
const demanderRoutes = require("./routes/demandeRoutes");
const volunteerRoutes = require('./routes/volunteerRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const donationRoutes = require('./routes/donationRoutes');
const rapportRoutes = require('./routes/rapportRoutes');
const projectRoutes = require('./routes/projectRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const abonnementRoutes = require('./routes/abonnementRoutes');
const uploads = require('./utils/upload'); 

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);

// CORS configuration (from .env or default to localhost:4200)
const allowedOrigin = process.env.N8N_CORS_ALLOW_ORIGIN || 'http://localhost:4200';
console.log("CORS Origin Allowed:", allowedOrigin);

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Socket.IO configuration with same CORS origin
const io = socketIo(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Socket.IO handlers
require('./socket/socket')(io);

// Routes
app.use('/', routes);
app.use('/api/donors', donorRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/demande", demanderRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/rapport', rapportRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/abonnement', abonnementRoutes);


const axios = require('axios'); // If not already imported




// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
