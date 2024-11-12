import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/email";
import nodemailer from "nodemailer";
import { env } from "../env";
import { FastifyReply, FastifyRequest } from "fastify";

interface SendInviteReq extends FastifyRequest {
  params: {
    tripId: string;
  };
  body: {
    email: string
  }
};

export const sendInviteController = async (req: SendInviteReq, reply: FastifyReply) => {
  const { tripId } = req.params;
  const { email } = req.body;

  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });

  if (!trip) {
    return reply.status(404).send({ error: "Trip not found!" });
  }

  const participant = await prisma.participant.create({
    data: {
      email,
      trip_id: tripId,
    },
  });

  const emailToSend = await getMailClient();
  const formattedStartDate = dayjs(trip.starts_at).format("LL");
  const formattedEndDate = dayjs(trip.ends_at).format("LL");
  const confirmationLink = `${env.WEB_BASE_URL}/participants/${participant.id}/confirm`;

  try {
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
            Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de ${formattedStartDate} a ${formattedEndDate}.
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

    return reply.status(201).send({ participantId: participant.id });
  } catch (error) {
    return reply.status(500).send({ error: "Failed to send invitation email." });
  }
};