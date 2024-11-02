import { z } from "zod";

const getActivitySchema = {
  tags: ["Activities"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
}

const createActivitySchema = {
  tags: ["Activities"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(4),
    occurs_at: z.coerce.date(),
  }),
}

export {
  getActivitySchema,
  createActivitySchema
}