import nodemailer from "nodemailer";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { env } from "../env";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/email";

interface CreateTripReq extends FastifyRequest {
  body: {
    destination: string;
    starts_at: Date;
    ends_at: Date;
    owner_name: string;
    owner_email: string;
    emails_to_invite: string[];
  };
}

interface ConfirmTripReq extends FastifyRequest {
  params: {
    tripId: string;
  };
}

interface UpdateTripReq extends FastifyRequest {
  params: {
    tripId: string;
  };
  body: {
    destination: string;
    starts_at: Date;
    ends_at: Date;
  };
}

interface getTripReq extends FastifyRequest {
  params: {
    tripId: string;
  };
}

export const createTripController = async (req: CreateTripReq) => {
  const {
    destination,
    starts_at,
    ends_at,
    owner_email,
    owner_name,
    emails_to_invite,
  } = req.body;

  if (
    dayjs(starts_at).isBefore(new Date()) ||
    dayjs(ends_at).isBefore(starts_at)
  ) {
    throw new Error("Invalid trip date.");
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
            ...emails_to_invite.map((email) => ({
              email,
            })),
          ],
        },
      },
    },
  });

  const mail = await getMailClient();
  const formatedStartedDate = dayjs(starts_at).format("LL");
  const formatedEndDate = dayjs(ends_at).format("LL");
  const confirmationLink = `${env.WEB_BASE_URL}/trips/${trip.id}/confirm`;

  const message = await mail.sendMail({
    from: {
      name: "Planner Team",
      address: "planner@email.com",
    },
    to: {
      name: "Gui Almeida",
      address: "guisalmeida.dev@gmail.com",
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
    `.trim(),
  });

  console.log(nodemailer.getTestMessageUrl(message));

  return { tripId: trip.id };
};

export const confirmTripController = async (req: ConfirmTripReq, reply: FastifyReply) => {
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
    return reply.redirect(`${env.API_BASE_URL}/trips/${tripId}`);
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: { is_confirmed: true },
  });

  const formatedStartedDate = dayjs(trip.starts_at).format("LL");
  const formatedEndDate = dayjs(trip.ends_at).format("LL");
  const email = await getMailClient();

  await Promise.all(
    trip.participants.map(async (participant) => {
      const confirmationLink = `${env.WEB_BASE_URL}/participants/${participant.id}/confirm`;

      const message = await email.sendMail({
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

  return reply.redirect(`${env.API_BASE_URL}/trips/${tripId}`);
};

export const updateTripController = async (req: UpdateTripReq) => {
  const { tripId } = req.params;
  const { destination, starts_at, ends_at } = req.body;

  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });

  if (!trip) {
    throw new Error("Trip not found.");
  }

  if (
    dayjs(starts_at).isBefore(new Date()) ||
    dayjs(ends_at).isBefore(starts_at)
  ) {
    throw new Error("Invalid trip date.");
  }

  await prisma.trip.update({
    where: {
      id: tripId,
    },
    data: {
      destination,
      ends_at,
      starts_at,
    },
  });

  return { tripId: trip.id };
};

export const getTripController = async (req: getTripReq) => {
  const { tripId } = req.params;

  const trip = await prisma.trip.findUnique({
    select: {
      id: true,
      starts_at: true,
      ends_at: true,
      is_confirmed: true,
      destination: true,
      participants: true,
      links: true,
      activities: {
        orderBy: {
          occurs_at: "asc",
        },
      },
    },
    where: {
      id: tripId,
    },
  });

  if (!trip) {
    throw new Error("Trip not found!");
  }

  return { trip };
};
