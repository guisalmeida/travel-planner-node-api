import { z } from "zod";
import { participant } from "./participantSchemas";
import { link } from "./linkSchemas";
import { activity } from "./activitySchemas";

const createTripSchema = {
  tags: ["Trip"],
  body: z.object({
    destination: z.string().min(4),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
    owner_name: z.string(),
    owner_email: z.string(),
    emails_to_invite: z.array(z.string().email()),
  }),
  response: {
    201: z.object({
      tripId: z.string().uuid(),
    }),
    400: z
      .object({
        error: z.string(),
      })
      .describe("Invalid trip date"),
  },
};

const confirmTripSchema = {
  tags: ["Trip"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  response: {
    303: z.null().describe("Redirect to the trip page after confirmation"),
    404: z
      .object({
        error: z.string(),
      })
      .describe("Trip not found"),
  },
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
  reponse: {
    200: z.object({
      tripId: z.string().uuid(),
    }),
    400: z
      .object({
        error: z.string(),
      })
      .describe("Invalid trip date"),
    404: z
      .object({
        error: z.string(),
      })
      .describe("Trip not found"),
  },
};

const getTripSchema = {
  tags: ["Trip"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  response: {
    200: z.object({
      trip: z.object({
        id: z.string().uuid(),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
        is_confirmed: z.boolean(),
        destination: z.string(),
        participants: z.array(participant),
        links: z.array(link),
        activities: z.array(activity),
      }),
    }),
    404: z
      .object({
        error: z.string(),
      })
      .describe("Trip not found"),
  },
};

export { createTripSchema, confirmTripSchema, updateTripSchema, getTripSchema };
