const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
let reconnectDelay = 90;

app.use(express.json({ extends: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/books.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

function listen() {
  try {
    app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
  } catch (e) {
    console.log("Server error: ", e.message);
    process.exit(1);
  }
}

mongoose.connection
.on('error', (err) => console.log(err.message))
.on('disconnected', connect)
.once('open', listen);

function connect() {
  if (reconnectDelay < 90000) {
    reconnectDelay *= 2;
  }
  setTimeout(() => {
    return mongoose.connect(config.get('mongoUri'), {
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoReconnect: false
    });
  }, reconnectDelay);
}

connect();