import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const ErrorHadler: FastifyErrorHandler = (err, req, res) => {
  console.log(err);
	if (err instanceof ZodError) {
		return res.status(400).send({
			message: 'Invalid input',
			errors: err.flatten().fieldErrors
		})
	}

  if (err instanceof Error) {
    return res.status(400).send({ message: err.message });
  }

  return res.status(500).send({ message: "Internal server error!" });
};
