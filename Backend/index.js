import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/AuthRoutes.js';
import contactsRoute from './routes/ContactRoute.js';
import setupSocket from './socket.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

app.use("/uploads/profiles", express.static("uploads/profiles"))

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactsRoute)


const server = app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
});


setupSocket(server)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('MongoDB connection error:', error));
