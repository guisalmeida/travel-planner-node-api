import { z } from "zod";

const confirmParticipantSchema = {
  tags: ["Participants"],
  params: z.object({
    participantId: z.string().uuid(),
  }),
}

const getParticipantSchema = {
  tags: ["Participants"],
  params: z.object({
    participantId: z.string().uuid(),
  }),
}

const getParticipantsSchema = {
  tags: ["Participants"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
}

export {
  confirmParticipantSchema,
  getParticipantSchema,
  getParticipantsSchema
}