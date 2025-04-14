require("dotenv").config();
import "module-alias/register";
import chalk from "chalk";
import Fastify from "fastify";

import connectToDatabase from "./utils/connectToDatabase";
import setupCors from "./utils/setupCors";
import setupRoutes from "./utils/setupRoutes";
import { log } from "console";

const port = Number(process.env.PORT) || 3000;

const initializeServer = async () => {
  log(`==================`);
  log(`     E  O  N      `);
  log(`==================`);
  log(chalk.blue.bold(`- Environment: ${process.env.NODE_ENV || "dev"}`));
  log(chalk.bgBlack(`Starting server...\n`));

  const fastify = Fastify({
    maxParamLength: 1000,
    logger: true,
  });

  await setupCors(fastify);
  await connectToDatabase();
  setupRoutes(fastify);

  fastify.listen({ port }, (err, address) => {
    if (err) {
      log(chalk.bgRedBright("OKNOTOK - Server failed to start:"));
      log(chalk.bgRedBright(err));

      process.exit(1);
    }

    log(
      chalk.bgGreen(
        `OK COMPUTER - Server is running on ${chalk.white.bgBlue.bold(address)}`
      )
    );
  });
};

initializeServer();
