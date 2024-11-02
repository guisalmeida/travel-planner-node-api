import { prisma } from "../lib/prisma";
import { env } from "../env";
import { FastifyReply, FastifyRequest } from "fastify";

interface ConfirmParticipantReq extends FastifyRequest {
  params: {
    participantId: string;
  };
};

interface GetParticipantReq extends FastifyRequest {
  params: {
    participantId: string;
  };
};

interface GetParticipantsReq extends FastifyRequest {
  params: {
    tripId: string;
  };
};

export const confirmParticipantController = async (req: ConfirmParticipantReq, res: FastifyReply) => {
  const { participantId } = req.params;
  const participant = await prisma.participant.findUnique({
    where: {
      id: participantId,
    },
  });

  if (!participant) {
    throw new Error("Participant not found!");
  }

  if (participant.is_confirmed) {
    return res.redirect(
      `${env.API_BASE_URL}/trips/${participant.trip_id}`
    );
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: { is_confirmed: true },
  });

  return res.redirect(`${env.API_BASE_URL}/trips/${participant.trip_id}`);
}

export const getParticipantController = async (req: GetParticipantReq) => {
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
    throw new Error("Participant not found!");
  }

  return { participant };
}

export const getparticipantsController = async (req: GetParticipantsReq) => {
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
    throw new Error("Trip not found!");
  }

  return { participants: trip.participants };
}