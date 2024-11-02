import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createTripSchema,
  confirmTripSchema,
  updateTripSchema,
  getTripSchema,
} from "../schemas/tripSchemas";

import {
  confirmTripController,
  createTripController,
  getTripController,
  updateTripController,
} from "../controllers/tripControllers";

const createTripOpts = {
  schema: createTripSchema,
  handler: createTripController,
};

const confirmTripOpts = {
  schema: confirmTripSchema,
  handler: confirmTripController,
};

const updateTripOpts = {
  schema: updateTripSchema,
  handler: updateTripController,
};

const getTripOpts = {
  schema: getTripSchema,
  handler: getTripController,
};

export async function tripRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trips", createTripOpts);

  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/trips/:tripId/confirm", confirmTripOpts);

  app.withTypeProvider<ZodTypeProvider>().put("/trips/:tripId", updateTripOpts);

  app.withTypeProvider<ZodTypeProvider>().get("/trips/:tripId", getTripOpts);
}
