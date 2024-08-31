const connectToMongo = require('./db.js');
const express = require('express');
const cors = require('cors')
// --------------------------DATABASE CONNECTION------------------------
connectToMongo();
// ---------------------------------------------------------------------


// -------------------------EXPRESS SERVER------------------------------
const app = express();
const port = 5000;
app.use(cors({
  origin: 'http://localhost:5173', // Allow specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'auth-token'] // Specify allowed headers
}));


// -------------NECESSARY TO USE req.body (Middleware)------
app.use(express.json())

// --------------------------------------------

//---------------AVAILABLE ROUTES--------------
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/todos', require('./routes/todos.js'));
app.use('/', (req,res) => {
  res.json({message:'Express backend'})
});
// -------------------------------------------------

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
})