import fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { env } from "./env";
import { ErrorHadler } from "./errorHandler";
import { participantRoutes } from "./routes/participantRoutes";
import { linkRoutes } from "./routes/linkRoutes";
import { tripRoutes } from "./routes/tripRoutes";
import { activityRoutes } from "./routes/activityRoutes";
import { inviteRoutes } from "./routes/inviteRoutes";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    },
  }
});

app.register(fastifySwaggerUi, {
  routePrefix: "/documentation",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(ErrorHadler);

app.register(activityRoutes);
app.register(tripRoutes);
app.register(linkRoutes);
app.register(participantRoutes);
app.register(inviteRoutes);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running...");
});
