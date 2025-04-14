import chalk from "chalk";
import { log } from "console";
import mongoose, { ConnectOptions } from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.CONNECTION_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    log(chalk.bgGreen(`OK COMPUTER - Connected to the database!`));
  } catch (error) {
    log(chalk.bgRedBright("OKNOTOK - Database connection failed:"));
    log(chalk.bgRedBright(error));

    process.exit(1);
  }
};

export default connectToDatabase;
