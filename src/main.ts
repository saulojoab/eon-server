require("dotenv").config();
import chalk from "chalk";
import mongoose, { ConnectOptions } from "mongoose";
import Fastify from "fastify";
import FastifyCors from "@fastify/cors";
import { UserRoutes } from "./routes";
import { HttpStatusCode } from "axios";

const port = Number(process.env.PORT) || 3000;

const log = console.log;

(async () => {
  log(`==================`);
  log(`=    E  O  N     =`);
  log(`==================`);
  log(chalk.blue.bold(`- Environment: ${process.env.NODE_ENV || "dev"}`));
  log(chalk.bgBlack(`Starting server...\n`));

  const fastify = Fastify({
    maxParamLength: 1000,
    logger: true,
  });

  await fastify.register(FastifyCors, {
    origin: "*",
    methods: "GET",
  });

  try {
    await mongoose.connect(`${process.env.CONNECTION_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    log(chalk.bgGreen(`OK COMPUTER - Connected to the database!`));

    fastify.get("/", (_, rp) => {
      rp.status(HttpStatusCode.Ok).send("Welcome to the EON API!");
    });

    fastify.get("*", (request, reply) => {
      reply.status(HttpStatusCode.NotFound).send({
        message: "",
        error: "page not found",
      });
    });

    fastify.register(UserRoutes, { prefix: "/users" });

    fastify.listen({ port: port, host: "0.0.0.0" }, (e, address) => {
      if (e) throw e;

      log(
        chalk.bgGreen(
          `OK COMPUTER - Server is running on ${chalk.white.bgBlue.bold(
            address
          )}`
        )
      );
    });
  } catch (error) {
    log(chalk.bgRedBright("OKNOTOK - Something went wrong, check error:"));
    log(chalk.bgRedBright(error));
  }
})();
