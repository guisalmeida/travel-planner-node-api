import { dayjs } from "../lib/dayjs";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', { schema: {
    params: z.object({
      tripId: z.string().uuid()
    })
  }}, async (req) => {
    console.log(req.params.tripId);

    return {tripId: req.params.tripId}
  });
}