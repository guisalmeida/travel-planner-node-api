import { z } from "zod";

export const activity = z.object({
  title: z.string(),
  occurs_at: z.coerce.date(),
  id: z.string().uuid(),
  trip_id: z.string().uuid(),
});

const getActivitySchema = {
  tags: ["Activities"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  response: {
    404: z.object({
      error: z.string(),
    }),
    200: z.object({
      allActivities: z.array(
        z.object({
          date: z.coerce.date(),
          activities: z.array(activity),
        })
      ),
    }),
  },
};

const createActivitySchema = {
  tags: ["Activities"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  body: z
    .object({
      title: z.string().min(4),
      occurs_at: z.coerce.date(),
    })
    .describe(
      "*occurs_at should has value within the start and the end of the trip."
    ),
  response: {
    201: z.object({
      activityId: z.string().uuid(),
    }),
    400: z.object({
      error: z.string(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
};

export { getActivitySchema, createActivitySchema };
