const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes/index.js');
const donorRoutes = require('./routes/donorRoutes');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require("./routes/feedbackRoutes");
const demanderRoutes = require("./routes/demandeRoutes");

dotenv.config(); 
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());


//database connection 
connectDB();


//Routes
app.use('/', routes);
app.use('/api/donors', donorRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/contact", feedbackRoutes);
app.use("/api/demande", demanderRoutes);



//server

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});