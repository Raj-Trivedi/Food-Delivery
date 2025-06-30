import express from 'express';
import cors from 'cors';
import { connectDB } from './config/Connectdb.js';
import {foodRouter} from './routes/foodRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();
app.use('/api/food', foodRouter);

app.get('/', (req, res) => {
  res.send('API Testing');
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

