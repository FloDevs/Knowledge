const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection failed:', err));
