import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  createActivityController,
  getActivitiesController,
} from "../controllers/activityController";
import {
  createActivitySchema,
  getActivitySchema,
} from "../schemas/activitySchemas";

const getActivitiesOpts = {
  schema: getActivitySchema,
  handler: getActivitiesController,
};

const createActivityOpts = {
  schema: createActivitySchema,
  handler: createActivityController,
};

export async function activityRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/trips/:tripId/activities", getActivitiesOpts);

  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/trips/:tripId/activities", createActivityOpts);
}
