import NextAuth, { type Session, SessionStrategy } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ELoginResponseCode } from '@/types/login';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user || !user.passwordHash) throw new Error(ELoginResponseCode.USER_NOT_FOUND);
        const valid = await compare(credentials!.password, user.passwordHash);
        if (!valid) throw new Error(ELoginResponseCode.INVALID_PASSWORD);
        if (!user.emailVerified) throw new Error(ELoginResponseCode.EMAIL_NOT_VERIFIED);
        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.sub && session.user) session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
