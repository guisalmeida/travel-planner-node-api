import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";

export async function getTripDetails(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (req) => {
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
    }
  );
}
