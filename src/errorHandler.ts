import { error } from "console";
import { FastifyInstance } from "fastify";
import { ClientError } from "./errors/clientError";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const ErrorHadler: FastifyErrorHandler = (err, req, res) => {
  console.log(err);
	if (err instanceof ZodError) {
		return res.status(400).send({
			message: 'Inválid input',
			erros: err.flatten().fieldErrors
		})
	}

  if (err instanceof ClientError) {
    return res.status(400).send({ message: err.message });
  }

  return res.status(500).send({ message: "Internal server error!" });
};
