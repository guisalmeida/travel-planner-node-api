import fastify from "fastify";
import cors from "@fastify/cors";

import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { ErrorHadler } from "./errorHandler";
import { env } from "./env";
import { participantRoutes } from "./routes/participantRoutes";
import { linkRoutes } from "./routes/linkRoutes";
import { tripRoutes } from "./routes/tripRoutes";
import { activityRoutes } from "./routes/activityRoutes";
import { inviteRoutes } from "./routes/inviteRoutes";

const app = fastify();

app.register(cors, {
  origin: "*",
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
