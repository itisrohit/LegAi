import { handleQuery } from '../controllers/queryController.js';

export async function queryRoutes(fastify, options) {
  fastify.post('/query', handleQuery);
}
