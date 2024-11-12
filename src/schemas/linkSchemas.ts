import { z } from "zod";

export const link = z.object({
  title: z.string(),
  url: z.string().url(),
  id: z.string().uuid(),
  trip_id: z.string().uuid(),
});

const getLinksSchema = {
  tags: ["Links"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  response: {
    404: z.object({
      error: z.string(),
    }),
    200: z.object({
      links: z.array(link),
    }),
  },
};

const createLinkSchema = {
  tags: ["Links"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(4),
    url: z.string().url(),
  }),
  response: {
    201: z.object({
      LinkId: z.string().uuid(),
    }),
    400: z.object({
      error: z.string(),
    }),
    404: z.object({
      error: z.string(),
    }),
  },
};

export { getLinksSchema, createLinkSchema };
