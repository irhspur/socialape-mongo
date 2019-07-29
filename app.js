const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = 9000;

app.use(cors());
app.use(express.json());

const uri = process.env.URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connected');
});

const userRouter = require('./routes/users');
const screamRouter = require('./routes/screams');

app.use('/api/users', userRouter);
app.use('/api/screams', screamRouter);

app.get('/', (req, res) => res.send('Hello Worldo'));

// app.get('/api/getUsers', (req, res) => {
//   // console.log('in getusers', req, res);
//   // res.setHeader('Content-Type', 'application/json');
//   res.json({ a: 1 });
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
