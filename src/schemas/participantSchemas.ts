import { z } from "zod";

export const participant = z.object({
  id: z.string().uuid(),
  name: z.union([z.string(), z.null()]),
  is_confirmed: z.boolean(),
  email: z.string().email(),
});

const confirmParticipantSchema = {
  tags: ["Participants"],
  params: z.object({
    participantId: z.string().uuid(),
  }),
  response: {
    303: z.null().describe("Redirect to the trip page after confirmation"),
    404: z
      .object({
        error: z.string(),
      })
      .describe("Participant not found"),
  },
};

const getParticipantSchema = {
  tags: ["Participants"],
  params: z.object({
    participantId: z.string().uuid(),
  }),
  response: {
    200: z
      .object({
        participant: participant,
      })
      .describe("Returns the corresponding participant."),
    404: z
      .object({
        error: z.string(),
      })
      .describe("Participant not found"),
  },
};

const getParticipantsSchema = {
  tags: ["Participants"],
  params: z.object({
    tripId: z.string().uuid(),
  }),
  response: {
    200: z.object({
      participants: z.array(participant),
    }).describe("List of participants"),
    404: z
      .object({
        error: z.string(),
      })
      .describe("Trip not found"),
  },
};

export {
  confirmParticipantSchema,
  getParticipantSchema,
  getParticipantsSchema,
};
