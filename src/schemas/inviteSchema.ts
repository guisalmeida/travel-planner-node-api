import { z } from "zod";

const sendInviteSchema = {
  tags: ["Invite"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  body: z.object({
    email: z.string().email(),
  }),
  response: {
    404: z.object({
      error: z.string()
    }),
    201: z.object({
      participantId: z.string().uuid()
    }),
    500: z.object({
      error: z.string()
    }),
  }
}

export {
  sendInviteSchema
}