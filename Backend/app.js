const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes/index.js');
const donorRoutes = require('./routes/donorRoutes');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require("./routes/feedbackRoutes");
const demanderRoutes = require("./routes/demandeRoutes");
const volunteerRoutes = require('./routes/volunteerRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const donationRoutes  = require('./routes/donationRoutes');
const rapportRoutes = require('./routes/rapportRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploads = require('./utils/upload'); 


dotenv.config(); 
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 


//database connection 
connectDB();


//Routes
app.use('/', routes);
app.use('/api/donors', donorRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/demande", demanderRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/payment', paymentRoutes); 
app.use('/api/donations', donationRoutes);
app.use('/api/rapport', rapportRoutes); 
app.use('/api/projects', projectRoutes);








//server

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});