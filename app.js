import express from 'express';
import cors from 'cors';
import getRouter from './routes/getRoutes.js';
import postRouter from './routes/postRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('APIs are running'));

app.use('/api/get', getRouter);

app.use('/api/post', postRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});