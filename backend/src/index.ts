// Ensure environment variables are loaded before importing modules that use them
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', chatRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});