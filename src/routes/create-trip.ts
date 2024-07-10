import { FastifyInstance } from 'fastify';
import {prisma} from '../lib/prisma';

export async function createTrip(app: FastifyInstance) {
  app.post('/trips', async () => {
    await prisma.trip.create({
      data: {
        destination: "destination",
        ends_at: new Date(),
        starts_at: new Date(),
      }
    })
  
    return 'Trip registered succesfully!'
  });
}