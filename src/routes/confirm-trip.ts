import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/email";
import nodemailer from "nodemailer";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (req, res) => {
      const { tripId } = req.params;
      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          // works as a join with the table participants
          participants: {
            // This will be an attribute within the trip object variable (trip.participants)
            where: {
              is_owner: false,
            },
          },
        },
      });

      // Query to find participants without join (include):
      // const participants = prisma.participant.findMany({
      //   where: {
      //     trip_id: tripId,
      //     is_owner: false
      //   }
      // })

      if (!trip) {
        throw new Error("Trip not found!");
      }

      if (trip.is_confirmed) {
        return res.redirect(`http://localhost:3000/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      });

      const formatedStartedDate = dayjs(trip.starts_at).format("LL");
      const formatedEndDate = dayjs(trip.ends_at).format("LL");
      const mail = await getMailClient();

      await Promise.all(
        trip.participants.map(async (participant) => {
          const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;

          const message = await mail.sendMail({
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
        })
      );

      return res.redirect(`http://localhost:3000/trips/${tripId}`);
    }
  );
}
