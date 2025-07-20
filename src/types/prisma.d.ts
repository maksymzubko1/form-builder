// global.d.ts or prisma.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var prisma`
  var prisma: PrismaClient | undefined;
}

export {};
