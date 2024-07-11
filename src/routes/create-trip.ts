import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getMailClient } from '../lib/email';
import dayjs from 'dayjs';
import nodemailer from 'nodemailer';

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips', { schema: {
    body: z.object({
      destination: z.string().min(4),
      starts_at: z.coerce.date(),
      ends_at: z.coerce.date(),
      owner_name: z.string(),
      owner_mail: z.string()
    })
  }}, async (req) => {
    const {destination, starts_at, ends_at} = req.body;

    if (dayjs(starts_at).isBefore(new Date()) || dayjs(ends_at).isBefore(starts_at)) {
      throw new Error('Invalid trip date.')
    }

    const trip = await prisma.trip.create({
      data: {
        destination,
        ends_at,
        starts_at
      }
    });

    const mail = await getMailClient();

    const message = await mail.sendMail({
      from: {
        name: 'Planner Team',
        address: 'planner@email.com'
      },
      to: {
        name: 'Gui Almeida',
        address: 'guisalmeida.dev@gmail.com'
      },
      subject: 'Mail test',
      html: '<p>Testing....</p>'
    })

    console.log(nodemailer.getTestMessageUrl(message));
    
    return {tripId: trip.id}
  });
}