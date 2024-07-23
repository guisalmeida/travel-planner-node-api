import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/createTrip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirmTrip";
import { confirmParticipant } from "./routes/confirmParticipant";
import { createActivity } from "./routes/createActivity";
import { getActivities } from "./routes/getActivities";
import { createLink } from "./routes/createLink";
import { getLinks } from "./routes/getLinks";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/createInvite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/getTripDetails";
import { getParticipant } from "./routes/get-participant";
import { ErrorHadler } from "./errorHandler";
import { env } from "./env";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(ErrorHadler);

app.register(createTrip);
app.register(createActivity);
app.register(createLink);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(getActivities);
app.register(getLinks);
app.register(getParticipants);
app.register(createInvite);
app.register(updateTrip);
app.register(getTripDetails);
app.register(getParticipant);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running...");
});
