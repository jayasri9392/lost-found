const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to prevent Windows SRV lookup timeouts with Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback to default if not permitted
}

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables. Please configure it in your hosting platform (Render/Railway/Heroku/Vercel) or .env file.');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
