import express from 'express';
import cors from 'cors';
import { connectDB } from './config/Connectdb.js';
import { foodRouter } from './routes/foodRoute.js';
import { orderRouter } from './routes/orderRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads statically
app.use('/upload', express.static(path.join(__dirname, 'upload')));

const PORT = process.env.PORT || 5000;

//DB connection
connectDB();
app.use('/api/food',foodRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send('Api Testing');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

