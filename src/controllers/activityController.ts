import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { FastifyReply, FastifyRequest } from "fastify";

interface GetActivitiesReq extends FastifyRequest {
  params: {
    tripId: string;
  };
};

interface CreateActivitiesReq extends FastifyRequest {
  params: {
    tripId: string;
  };
  body: {
    title: string,
    occurs_at: Date
  }
};

export const getActivitiesController = async (req: GetActivitiesReq, reply: FastifyReply) => {
  const { tripId } = req.params;

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { activities: true },
  });

  if (!trip) {
    reply.status(404).send({ error: "Trip not found!" });
    return;
  }

  const diffDaysBetweenStartAndEnd = dayjs(trip.ends_at).diff(
    trip.starts_at,
    "days"
  );

  const activities = Array.from({ length: diffDaysBetweenStartAndEnd + 1 }).map((_, index) => {
    const date = dayjs(trip.starts_at).add(index, "days");

    return {
      date: date.toDate(),
      activities: trip.activities.filter((activity) => {
        return dayjs(activity.occurs_at).isSame(date, "day");
      }),
    };
  });

  reply.send({ activities });
};

export const createActivityController = async (req: CreateActivitiesReq) => {
  const { tripId } = req.params;
  const { title, occurs_at } = req.body;

  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });

  if (!trip) {
    throw new Error("Trip not found!");
  }

  if (
    dayjs(occurs_at).isBefore(trip.starts_at) ||
    dayjs(occurs_at).isAfter(trip.ends_at)
  ) {
    throw new Error("Invalid date.");
  }

  const activity = await prisma.activity.create({
    data: {
      title,
      occurs_at,
      trip_id: tripId,
    },
  });

  return { activityId: activity.id };
}