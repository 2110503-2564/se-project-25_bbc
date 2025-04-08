import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Import Database
import connectDB from './config/mongo.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import accountRoutes from './routes/accountRoutes.js'

// -------------------------- Configuration -------------------------- //
dotenv.config();
const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL, 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes 
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/account",accountRoutes);


// -------------------------- Socket.io Setup -------------------------- //

const superAdminSockets = {};
const hotelSockets = {};
const userSockets = {};

io.on('connection', (socket) => {

    // Super admin connection
    socket.on('superAdminConnect', (admin_id) => {

        if (superAdminSockets[admin_id]) superAdminSockets[admin_id].disconnect();
        
        superAdminSockets[admin_id] = socket; 

    }); 

    // Hotel admin connection
    socket.on('hotelAdminConnect', (hotel_id) => {

        if (!hotelSockets[hotel_id]) 
            hotelSockets[hotel_id] = [];

        const existingSocketIndex = hotelSockets[hotel_id].indexOf(socket);
        if (existingSocketIndex === -1) hotelSockets[hotel_id].push(socket); 

    });  

    // User connection
    socket.on('userConnect', (user_id) => {

        if (userSockets[user_id]) userSockets[user_id].disconnect();
        
        userSockets[user_id] = socket; 

    });

    // Disconnect
    socket.on('disconnect', () => {

        // Remove the socket when user disconnects
        for (let admin_id in superAdminSockets) {
            if (superAdminSockets[admin_id] === socket) {
                delete superAdminSockets[admin_id];
                break;
            }
        }

        // Remove the socket when hotel admin disconnects
        for (let hotel_id in hotelSockets) {
            const index = hotelSockets[hotel_id].indexOf(socket);
            if (index !== -1) {
                hotelSockets[hotel_id].splice(index, 1); 
                break;
            }
        }

        // Remove the socket when user disconnects
        for (let user_id in userSockets) {
            if (userSockets[user_id] === socket) {
                delete userSockets[user_id];
                break;
            }
        }

    });

    // 

});

// -------------------------- Start the Server -------------------------- //

const PORT = process.env.PORT || 8000;

const initializeServer = async () =>{
    try{
        console.log('🚀 Starting C-Canteen backend server...');
        
        // MongoDB Connection
        console.log('🔗 Connecting to MongoDB...');
        await connectDB(); 

        server.listen(PORT , '0.0.0.0', () => {
            console.log(`🎉 BBC Backend server is live at ${process.env.HOST}:${PORT} 🎉`);
        });
    }
    catch(err){
        console.log('❌ Failed to start the BBC backend server: ', err);
    }
}

initializeServer();

export { userSockets , hotelSockets , superAdminSockets , io };