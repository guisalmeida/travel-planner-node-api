import { prisma } from "../lib/prisma";
import { env } from "../env";
import { FastifyReply, FastifyRequest } from "fastify";

interface ConfirmParticipantReq extends FastifyRequest {
  params: {
    participantId: string;
  };
}

interface GetParticipantReq extends FastifyRequest {
  params: {
    participantId: string;
  };
}

interface GetParticipantsReq extends FastifyRequest {
  params: {
    tripId: string;
  };
}

export const confirmParticipantController = async (
  req: ConfirmParticipantReq,
  reply: FastifyReply
) => {
  const { participantId } = req.params;
  const participant = await prisma.participant.findUnique({
    where: {
      id: participantId,
    },
  });

  if (!participant) {
    return reply.status(404).send({ error: "Participant not found!" });
  }

  if (participant.is_confirmed) {
    return reply
      .status(303)
      .redirect(`${env.API_BASE_URL}/trips/${participant.trip_id}`);
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: { is_confirmed: true },
  });

  return reply
    .status(303)
    .redirect(`${env.API_BASE_URL}/trips/${participant.trip_id}`);
};

export const getParticipantController = async (
  req: GetParticipantReq,
  reply: FastifyReply
) => {
  const { participantId } = req.params;

  const participant = await prisma.participant.findUnique({
    where: {
      id: participantId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      is_confirmed: true,
    },
  });

  if (!participant) {
    return reply.status(404).send({ error: "Participant not found!" });
  }

  return reply.send({ participant });
};

export const getparticipantsController = async (
  req: GetParticipantsReq,
  reply: FastifyReply
) => {
  const { tripId } = req.params;

  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
    include: {
      participants: {
        select: {
          id: true,
          name: true,
          email: true,
          is_confirmed: true,
        },
        orderBy: {
          email: "asc",
        },
      },
    },
  });

  if (!trip) {
    return reply.status(404).send({ error: "Trip not found!" });
  }

  return reply.send({ participants: trip.participants });
};
