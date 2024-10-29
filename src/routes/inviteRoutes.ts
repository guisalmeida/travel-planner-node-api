import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/email";
import nodemailer from "nodemailer";
import { env } from "process";

export async function inviteRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (req) => {
      const { tripId } = req.params;
      const { email } = req.body;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) {
        throw new Error("Trip not found!");
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const emailToSend = await getMailClient();
      const formatedStartedDate = dayjs(trip.starts_at).format("LL");
      const formatedEndDate = dayjs(trip.ends_at).format("LL");
      const confirmationLink = `${env.WEB_BASE_URL}/participants/${participant.id}/confirm`;

      const message = await emailToSend.sendMail({
        from: {
          name: "Planner Team",
          address: "planner@email.com",
        },
        to: participant.email,
        subject: `Confirm your trip to ${trip.destination}`,
        html: `
      <div style="text-align: center;">
            <h2>
              Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de ${formatedStartedDate} a ${formatedEndDate}.
            </h2>
    
            <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
            <a href="${confirmationLink}" >Confirmar presença</a>
    
            <p>Caso esteja usando o dispositivo móvel, você também pode confirmar a criação da viagem pelos aplicativos:</p>
    
            <a href="#">Aplicativo para iPhone</a>
            <br>
            <a href="#">Aplicativo para Android</a>
            <br>
            <small>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</small>
          </div>
      `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { participantId: participant.id };
    }
  );
}
