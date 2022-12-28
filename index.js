import express from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import cors from 'cors';
import { setting } from './config/keys.js';
import university from './routes/university.js';
import department from './routes/department.js';
import course from './routes/course.js';
import document from './routes/document.js';

const app = express();
const { mongoURI } = setting;

app.use(cors());
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

mongoose
  .connect(
    mongoURI,
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.warn(err))
  
app.use('/public', express.static('public'));

app.use('/api/university', university);
app.use('/api/department', department);
app.use('/api/course', course);
app.use('/api/document', document)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
