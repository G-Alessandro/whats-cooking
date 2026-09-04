import { beforeEach, afterAll } from "vitest";

import prisma from "../../src/clients/prisma.client";

beforeEach(async () => {
  await prisma.favoriteRecipe.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
