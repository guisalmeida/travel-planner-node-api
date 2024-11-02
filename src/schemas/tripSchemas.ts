import { z } from "zod";

const createTripSchema = {
  body: z.object({
    destination: z.string().min(4),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
    owner_name: z.string(),
    owner_email: z.string(),
    emails_to_invite: z.array(z.string().email()),
  }),
};

const confirmTripSchema = {
  tags: ["Trip"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
};

const updateTripSchema = {
  tags: ["Trip"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  body: z.object({
    destination: z.string().min(4),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
  }),
};

const getTripSchema = {
  tags: ["Trip"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
};

export { createTripSchema, confirmTripSchema, updateTripSchema, getTripSchema };
