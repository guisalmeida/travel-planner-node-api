import { z } from "zod";

const getLinksSchema = {
  tags: ["Links"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
}

const createLinkSchema = {
  tags: ["Links"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(4),
    url: z.string().url(),
  }),
}

export {
  getLinksSchema,
  createLinkSchema
}