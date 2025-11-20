import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import listingsRoutes from './routes/listings.js';
import uploadRoutes from './routes/upload.js';
import messagesRoutes from './routes/messages.js';
import adminRoutes from './routes/admin.js';
import escrowRoutes from './routes/escrow.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60*1000, max: 200 }));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/escrow', escrowRoutes);

app.get('/api/health', (req,res)=>res.json({ status:'ok', now: new Date() }));

const port = process.env.PORT || 4000;
app.listen(port, ()=>console.log(`MoonLord backend listening on ${port}`));
