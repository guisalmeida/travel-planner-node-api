import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  confirmParticipantController,
  getParticipantController,
  getparticipantsController,
} from "../controllers/participantController";
import {
  confirmParticipantSchema,
  getParticipantSchema,
  getParticipantsSchema,
} from "../schemas/participantSchemas";

const confirmParticipantOpts = {
  schema: confirmParticipantSchema,
  handler: confirmParticipantController,
};

const getParticipantOpts = {
  schema: getParticipantSchema,
  handler: getParticipantController,
};

const getParticipantsOpts = {
  schema: getParticipantsSchema,
  handler: getparticipantsController,
};

export async function participantRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/participants/:participantId/confirm", confirmParticipantOpts);

  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/participants/:participantId", getParticipantOpts);

  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/trips/:tripId/participants", getParticipantsOpts);
}
