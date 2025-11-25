import express from 'express';
const app =  express();
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import noteRoutes from './src/routes/noteRoutes.js';
import authRoutes from "./src/routes/authRoutes.js";
import cors from 'cors';


const PORT = process.env.PORT || 5000; // connects to port 5000 if no port in env
dotenv.config(); // load env variables
connectDB(); //connects to database

// ✅ Enable CORS for all origins
app.use(cors());

// If you want to restrict (only frontend)
app.use(cors({
  origin: "http://localhost:5173"
}));


app.use(express.json()); // this middleware allows us to accept json data in body

app.use("/api/auth", authRoutes);
app.use('/api/notes', noteRoutes); // all routes starting with /api/notes will be handled by noteRoutes


// In server.js, before app.listen
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end(); // respond with empty "No Content"
});

app.listen(PORT, () => {
    console.log(`server running  on port: ${PORT}`);
})
