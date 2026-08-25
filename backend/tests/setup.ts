import { vi, beforeEach, afterEach, afterAll } from "vitest";
import prisma from "../src/clients/prisma.client";

beforeEach(async () => {
  await prisma.favoriteRecipe.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});
