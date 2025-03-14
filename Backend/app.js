const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes/index.js');

dotenv.config(); 
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());


//database connection 
connectDB();


//Routes
app.use('/', routes);


//server

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});