import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";


import { createLinkController, getLinksController } from "../controllers/linkControllers";
import { createLinkSchema, getLinksSchema } from "../schemas/linkSchemas";

const getLinksOpts = {
  schema: getLinksSchema,
  handler: getLinksController,
};

const createLinkOpts = {
  schema: createLinkSchema,
  handler: createLinkController,
};

export async function linkRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/trips/:tripId/links", getLinksOpts);

  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/trips/:tripId/links", createLinkOpts);
}
