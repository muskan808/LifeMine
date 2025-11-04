const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/users', usersRouter);

// health
app.get('/', (req, res) => res.json({ ok: true, now: new Date() }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
