import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Database
import connectDB from './config/mongo.js';

// Import Socket
import { setSocketInstance } from './config/socket.js';
import { initializeChatSocket } from './utils/chat.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import accountRoutes from './routes/accountRoutes.js'
import chatRoutes from './routes/chatRoutes.js';
import promoRoutes from './routes/promoCodeRoute.js'
import uploadRoutes from './routes/uploadRoutes.js'

// import Swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express'

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------- Security Middlewares -------------------------- //

// Set security headers
app.use(helmet());

// Limit repeated requests to public APIs
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    keyGenerator: (req, res) => {
      if (req.user && req.user.id) 
        return req.user.id;
      return req.ip;
    }
});
app.use('/api', limiter);

// Enable CORS
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes 
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/promo", promoRoutes);
app.use('/api/uploads',uploadRoutes);
app.use('/uploads', express.static('public/uploads', {
  setHeaders: (res, path, stat) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Swagger Documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'Hotel Booking BBC API'
    }
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// -------------------------- Start the Server -------------------------- //

const PORT = process.env.PORT || 8000;

const initializeServer = async () =>{
    try{
        console.log('🚀 Starting BBC backend server...');

        setSocketInstance(io);
        initializeChatSocket(); 
        
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

