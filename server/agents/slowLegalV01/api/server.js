import fastify from 'fastify';
import dotenv from 'dotenv';
import { queryRoutes } from './routes/queryRoutes.js';
import { connectDB } from './services/mongodbService.js';

dotenv.config();

const server = fastify();

// Connect to MongoDB before starting server
const startServer = async () => {
  try {
    // Initialize MongoDB connection
    await connectDB();
    console.log('✅ MongoDB connection established successfully');

    // Register routes
    server.get('/', async (request, reply) => {
      return { status: 'Server is running' };
    });
    server.register(queryRoutes);
    console.log('✅ Routes registered successfully');

    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
      console.log(`✅ Server listening at ${address}`);
    });

  } catch (error) {
    console.error('❌ Startup error:', error);
    process.exit(1);
  }
};

startServer();

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  process.exit();
});