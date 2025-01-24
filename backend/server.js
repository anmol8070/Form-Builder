const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const formRoutes = require('./routes/formRoutes');
const userRoutes = require("./routes/userRoutes");
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// Enable CORS for all origins
app.use(cors());

app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/auth', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));