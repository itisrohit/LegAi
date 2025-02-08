import fastify from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import { queryRoutes } from './routes/queryRoutes.js';
import { connectDB } from './services/mongodbService.js';

dotenv.config();

const startServer = async () => {
  try {
    const server = fastify();

    // Register CORS plugin
    await server.register(cors, {
      origin: true,
      credentials: true
    });

    // Initialize MongoDB connection
    await connectDB();
    console.log('✅ MongoDB connection established successfully');

    // Register routes
    server.get('/', async (request, reply) => {
      return { status: 'Server is running' };
    });
    await server.register(queryRoutes);
    console.log('✅ Routes registered successfully');

    // Start server
    const PORT = process.env.PORT || 3000;
    await server.listen({ port: Number(PORT), host: '0.0.0.0' });
    console.log(`✅ Server listening at ${server.server.address().port}`);

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