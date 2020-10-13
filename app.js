if (process.env.NODE_DEV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const users = require('./routes/api/users');

const port = process.env.PORT || 4000;

const app = express();

// Parse Incoming Requests and Allow JSON Input
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('App successfully connected to mongoose...'));

// API Routes
app.use('/api/users', users);

app.listen(port, () => console.log(`Server running on port ${port}...`));
