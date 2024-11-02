import { z } from "zod";

const sendInviteSchema = {
  tags: ["Invite"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  body: z.object({
    email: z.string().email(),
  }),
}

export {
  sendInviteSchema
}