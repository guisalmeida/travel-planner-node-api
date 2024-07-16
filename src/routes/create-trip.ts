import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getMailClient } from '../lib/email';
import { dayjs } from '../lib/dayjs';
import nodemailer from 'nodemailer';

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips', { schema: {
    body: z.object({
      destination: z.string().min(4),
      starts_at: z.coerce.date(),
      ends_at: z.coerce.date(),
      owner_name: z.string(),
      owner_email: z.string(),
      emails_to_invite: z.array(z.string().email())
    })
  }}, async (req) => {
    const {
      destination, 
      starts_at, 
      ends_at, 
      owner_email, 
      owner_name, 
      emails_to_invite
    } = req.body;

    if (dayjs(starts_at).isBefore(new Date()) || dayjs(ends_at).isBefore(starts_at)) {
      throw new Error('Invalid trip date.')
    }

    const trip = await prisma.trip.create({
      data: {
        destination,
        ends_at,
        starts_at,
        participants: {
          createMany: {
            data: [
              {
                name: owner_name,
                email: owner_email,
                is_owner: true,
                is_confirmed: true,
              },
              ...emails_to_invite.map(email => ({
                email
              }))
            ]
            
          }
        }
      }
    });

    const mail = await getMailClient();

    const formatedStartedDate = dayjs(starts_at).format('LL');
    const formatedEndDate = dayjs(ends_at).format('LL');

    const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`

    const message = await mail.sendMail({
      from: {
        name: 'Planner Team',
        address: 'planner@email.com'
      },
      to: {
        name: 'Gui Almeida',
        address: 'guisalmeida.dev@gmail.com'
      },
      subject: `Confirm your trip to ${destination}`,
      html: `
      <div style="text-align: center;">
        <h2>
          Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de ${formatedStartedDate} a ${formatedEndDate}.
        </h2>

        <p>Para confirmar sua viagem, clique no link abaixo:</p>
        <a href="${confirmationLink}" >Confirmar viagem</a>

        <p>Caso esteja usando o dispositivo móvel, você também pode confirmar a criação da viagem pelos aplicativos:</p>

        <a href="#">Aplicativo para iPhone</a>
        <br>
        <a href="#">Aplicativo para Android</a>
        <br>
        <small>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</small>
      </div>
      `.trim()
    })

    console.log(nodemailer.getTestMessageUrl(message));
    
    return {tripId: trip.id}
  });
}