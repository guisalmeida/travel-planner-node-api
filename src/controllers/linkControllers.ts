import { FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

interface getLinksReq extends FastifyRequest {
  params: {
    tripId: string;
  };
}

interface CreatetLinkReq extends FastifyRequest {
  params: {
    tripId: string;
  };
  body: {
    title: string;
    url: string;
  };
}

export const getLinksController = async (req: getLinksReq) => {
  const { tripId } = req.params;

  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
    include: {
      links: true,
    },
  });

  if (!trip) {
    throw new Error("Trip not found!");
  }

  return { links: trip.links };
};

export const createLinkController = async (req: CreatetLinkReq) => {
  const { tripId } = req.params;
  const { title, url } = req.body;

  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });

  if (!trip) {
    throw new Error("Trip not found!");
  }

  const link = await prisma.link.create({
    data: {
      title,
      url,
      trip_id: tripId,
    },
  });

  return { linkId: link.id };
};
