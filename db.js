const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || 'todosDB';

const Connection = () => {
    // const MONGODB_URI = `mongodb://localhost:27017/Mytodos`;
    const MONGODB_URI = 'mongodb+srv://harshkanjar007:pzUWMWuAwGB7Zc6q@cluster0.qzcka.mongodb.net/'

    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Database connected successfully'))
        .catch((error) => console.log('Database connection failed:', error.message));
}

module.exports = Connection;
