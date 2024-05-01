import { PrismaClient } from "@prisma/client";
import { user, scores } from "./seedData";

const db = new PrismaClient();
const tick = "\u{2705}";
const cross = "\u{274C}";

const load = async () => {
  try {
    // Delete all scores in db
    await db.score.deleteMany();
    console.log(tick, "Deleted all scores.");

    // Delete all users in db
    await db.user.deleteMany();
    console.log(tick, "Deleted all users.");

    // Create a user in db
    const seededUser = await db.user.create({ data: user });
    console.log(tick, `Added user: ${seededUser.name}.`);

    // Add new user's id to scores data
    const userScores = scores.map((score) => ({
      ...score,
      userId: seededUser.id,
    }));

    // Create scores in db
    await db.score.createMany({ data: userScores });
    console.log(tick, "Added scores.");
  } catch (e) {
    console.error(cross, e);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
};
load();
