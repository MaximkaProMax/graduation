const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const photostudiosRoutes = require('./routes/photostudiosRoutes');
const printingRoutes = require('./routes/printingRoutes');
const bookingByPhoneRoutes = require('./routes/bookingByPhoneRoutes');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/photostudios', photostudiosRoutes);
app.use('/api/printing', printingRoutes);
app.use('/api/booking-by-phone', bookingByPhoneRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});