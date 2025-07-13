import { prisma } from './prisma';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';

export async function createToken(userId: string, type: 'verify' | 'reset') {
  const token = randomBytes(32).toString('hex');
  await prisma.token.create({
    data: {
      type,
      token,
      userId,
      expiresAt: addHours(new Date(), 24),
    },
  });
  return token;
}

export async function validateToken(token: string, type: 'verify' | 'reset') {
  const dbToken = await prisma.token.findUnique({ where: { token } });
  return !(!dbToken || dbToken.type !== type || dbToken.expiresAt < new Date());
}

export async function consumeToken(token: string, type: 'verify' | 'reset') {
  const dbToken = await prisma.token.findUnique({ where: { token } });
  if (!dbToken || dbToken.type !== type || dbToken.expiresAt < new Date()) return null;
  await prisma.token.delete({ where: { token } });
  return dbToken.userId;
}
