import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";


import { sendInviteController } from "../controllers/inviteController";
import { sendInviteSchema } from "../schemas/inviteSchema";

const sendInviteOpts = {
  schema: sendInviteSchema,
  handler: sendInviteController,
};

export async function inviteRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/trips/:tripId/invites", sendInviteOpts);
}
